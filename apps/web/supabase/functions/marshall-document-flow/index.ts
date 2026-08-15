import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const bucket = "marshall-case-documents";
const maxBytes = 20 * 1024 * 1024;

const allowedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-") || "document";
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (value.trim().startsWith("+")) {
    return value.trim();
  }

  return value.trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRole) {
      return json(
        { ok: false, error: "Server configuration missing." },
        500
      );
    }

    const admin = createClient(supabaseUrl, serviceRole, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const body = await req.json();
    const action = String(body?.action || "");


    // ========================================================
    // MARSHALL SENDS A REQUEST
    // ========================================================

    if (action === "request") {
      const authorization =
        req.headers.get("Authorization") || "";

      const accessToken =
        authorization.replace(/^Bearer\s+/i, "");

      if (!accessToken) {
        return json(
          { ok: false, error: "Authentication required." },
          401
        );
      }

      const {
        data: { user },
        error: userError,
      } = await admin.auth.getUser(accessToken);

      if (userError || !user) {
        return json(
          { ok: false, error: "Invalid Marshall session." },
          401
        );
      }

      const caseId = String(body.caseId || "");
      const documentId = String(body.documentId || "");
      const documentName = String(body.documentName || "");
      const clientPhone = normalizePhone(
        String(body.clientPhone || "").trim()
      );
      const clientName = String(body.clientName || "").trim();
      const caseNumber = String(body.caseNumber || "").trim();

      const requestMessage = String(
        body.requestMessage || ""
      ).trim();

      const outgoingStoragePath = String(
        body.outgoingStoragePath || ""
      ).trim();

      const outgoingFilename = String(
        body.outgoingFilename || ""
      ).trim();

      if (
        !caseId ||
        !documentId ||
        !documentName ||
        !clientPhone
      ) {
        return json(
          { ok: false, error: "Missing request information." },
          400
        );
      }

      const token = randomToken();
      const tokenHash = await sha256(token);

      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      await admin
        .from("marshall_document_requests")
        .update({
          status: "revoked",
          updated_at: new Date().toISOString(),
        })
        .eq("document_id", documentId)
        .eq("status", "pending");

      const { error: insertError } = await admin
        .from("marshall_document_requests")
        .insert({
          case_id: caseId,
          document_id: documentId,
          token_hash: tokenHash,
          client_phone: clientPhone,
          status: "pending",
          expires_at: expiresAt,
          request_message: requestMessage || null,
          request_document_name: documentName,
          outgoing_storage_path:
            outgoingStoragePath || null,
          outgoing_filename:
            outgoingFilename || null,
        });

      if (insertError) throw insertError;

      const publicBase =
        Deno.env.get("MARSHALL_PUBLIC_SITE_URL") ||
        "https://www.homeplanet.city";

      const uploadUrl =
        `${publicBase}/planet/marshall-rosenbach/document-upload?token=${token}`;

      return json({
        ok: true,
        uploadUrl,
        expiresAt,
      });
    }


    // ========================================================
    // CLIENT OPENS REQUEST PAGE
    // ========================================================

    if (action === "details") {
      const token = String(body.token || "");

      if (!token) {
        return json(
          { ok: false, error: "Missing secure token." },
          400
        );
      }

      const tokenHash = await sha256(token);

      const { data: requestRow, error } = await admin
        .from("marshall_document_requests")
        .select(`
          id,
          case_id,
          document_id,
          status,
          expires_at,
          request_message,
          request_document_name,
          outgoing_storage_path,
          outgoing_filename,
          marshall_case_documents (
            document_name
          )
        `)
        .eq("token_hash", tokenHash)
        .maybeSingle();

      if (error) throw error;

      if (!requestRow) {
        return json(
          { ok: false, error: "This secure request was not found." },
          404
        );
      }

      if (requestRow.status !== "pending") {
        return json(
          {
            ok: false,
            error:
              "This document request is no longer active.",
          },
          410
        );
      }

      if (
        new Date(requestRow.expires_at).getTime() <
        Date.now()
      ) {
        await admin
          .from("marshall_document_requests")
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", requestRow.id);

        return json(
          { ok: false, error: "This secure link has expired." },
          410
        );
      }

      let outgoingUrl = "";

      if (requestRow.outgoing_storage_path) {
        const { data: signed, error: signedError } =
          await admin.storage
            .from(bucket)
            .createSignedUrl(
              requestRow.outgoing_storage_path,
              3600
            );

        if (signedError) throw signedError;

        outgoingUrl = signed?.signedUrl || "";
      }

      return json({
        ok: true,
        documentName:
          requestRow.request_document_name ||
          requestRow.marshall_case_documents?.document_name ||
          "Requested Document",
        requestMessage:
          requestRow.request_message || "",
        outgoingFilename:
          requestRow.outgoing_filename || "",
        outgoingUrl,
      });
    }


    // ========================================================
    // CLIENT GETS A SIGNED UPLOAD URL
    // ========================================================

    if (action === "access") {
      const token = String(body.token || "");
      const filename = String(body.filename || "");
      const mimeType = String(body.mimeType || "");
      const fileSize = Number(body.fileSize || 0);

      if (!token || !filename) {
        return json(
          { ok: false, error: "Invalid upload request." },
          400
        );
      }

      if (!allowedTypes.has(mimeType)) {
        return json(
          {
            ok: false,
            error:
              "Upload a PDF, Word document, JPG, PNG, or WEBP file.",
          },
          400
        );
      }

      if (!fileSize || fileSize > maxBytes) {
        return json(
          {
            ok: false,
            error: "File must be 20 MB or smaller.",
          },
          400
        );
      }

      const tokenHash = await sha256(token);

      const { data: requestRow, error } = await admin
        .from("marshall_document_requests")
        .select(`
          id,
          case_id,
          document_id,
          status,
          expires_at,
          request_document_name,
          marshall_case_documents (
            document_name
          )
        `)
        .eq("token_hash", tokenHash)
        .maybeSingle();

      if (error) throw error;

      if (
        !requestRow ||
        requestRow.status !== "pending"
      ) {
        return json(
          {
            ok: false,
            error:
              "This upload request is no longer active.",
          },
          404
        );
      }

      if (
        new Date(requestRow.expires_at).getTime() <
        Date.now()
      ) {
        return json(
          {
            ok: false,
            error: "This upload link has expired.",
          },
          410
        );
      }

      const storagePath =
        `${requestRow.case_id}/${requestRow.document_id}/client-${Date.now()}-${safeName(filename)}`;

      const { data: signed, error: signedError } =
        await admin.storage
          .from(bucket)
          .createSignedUploadUrl(storagePath);

      if (signedError) throw signedError;

      return json({
        ok: true,
        documentName:
          requestRow.request_document_name ||
          requestRow.marshall_case_documents?.document_name ||
          "Requested Document",
        storagePath,
        signedToken: signed.token,
      });
    }


    // ========================================================
    // CLIENT FINISHES UPLOAD
    // ========================================================

    if (action === "complete") {
      const token = String(body.token || "");
      const storagePath = String(
        body.storagePath || ""
      );
      const filename = String(body.filename || "");
      const mimeType = String(body.mimeType || "");
      const fileSize = Number(body.fileSize || 0);

      if (!token || !storagePath || !filename) {
        return json(
          { ok: false, error: "Invalid completion request." },
          400
        );
      }

      const tokenHash = await sha256(token);

      const { data: requestRow, error } = await admin
        .from("marshall_document_requests")
        .select(`
          id,
          case_id,
          document_id,
          status,
          expires_at,
          request_document_name,
          marshall_case_documents (
            document_name,
            storage_path
          )
        `)
        .eq("token_hash", tokenHash)
        .maybeSingle();

      if (error) throw error;

      if (
        !requestRow ||
        requestRow.status !== "pending"
      ) {
        return json(
          {
            ok: false,
            error:
              "This upload request is no longer active.",
          },
          404
        );
      }

      const requiredPrefix =
        `${requestRow.case_id}/${requestRow.document_id}/`;

      if (!storagePath.startsWith(requiredPrefix)) {
        return json(
          { ok: false, error: "Invalid document path." },
          403
        );
      }

      const uploadedAt = new Date().toISOString();

      const oldStoragePath =
        requestRow.marshall_case_documents?.storage_path ||
        "";

      const { error: documentError } = await admin
        .from("marshall_case_documents")
        .update({
          status: "received",
          storage_path: storagePath,
          original_filename: filename,
          mime_type: mimeType || null,
          file_size: fileSize,
          uploaded_at: uploadedAt,
          updated_at: uploadedAt,
        })
        .eq("id", requestRow.document_id)
        .eq("case_id", requestRow.case_id);

      if (documentError) throw documentError;

      await admin
        .from("marshall_document_requests")
        .update({
          status: "completed",
          completed_at: uploadedAt,
          updated_at: uploadedAt,
        })
        .eq("id", requestRow.id);

      if (
        oldStoragePath &&
        oldStoragePath !== storagePath
      ) {
        await admin.storage
          .from(bucket)
          .remove([oldStoragePath]);
      }

      const documentName =
        requestRow.request_document_name ||
        requestRow.marshall_case_documents?.document_name ||
        "Document";

      await admin
        .from("marshall_case_truth_events")
        .insert({
          case_id: requestRow.case_id,
          event_type:
            "document_received_from_client",
          event_label:
            `${documentName} received from client`,
          event_detail: filename,
          event_meta: {
            document_id: requestRow.document_id,
            source: "secure_client_upload",
          },
        });

      return json({
        ok: true,
        documentName,
      });
    }

    return json(
      { ok: false, error: "Unknown action." },
      400
    );
  } catch (error) {
    console.error(
      "Marshall document flow failed:",
      error
    );

    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Document flow failed.",
      },
      500
    );
  }
});
