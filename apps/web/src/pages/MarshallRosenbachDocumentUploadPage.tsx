import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Download,
  FileText,
  FileUp,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function MarshallRosenbachDocumentUploadPage() {
  const token = useMemo(
    () =>
      new URLSearchParams(window.location.search).get(
        "token"
      ) || "",
    []
  );

  const [file, setFile] = useState<File | null>(null);

  const [documentName, setDocumentName] =
    useState("Requested Document");

  const [requestMessage, setRequestMessage] =
    useState("");

  const [outgoingFilename, setOutgoingFilename] =
    useState("");

  const [outgoingUrl, setOutgoingUrl] =
    useState("");

  const [loadingRequest, setLoadingRequest] =
    useState(true);

  const [status, setStatus] = useState<
    "idle" | "uploading" | "complete" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRequest() {
      if (!token) {
        setLoadingRequest(false);
        setStatus("error");
        setMessage(
          "This secure request link is missing or invalid."
        );
        return;
      }

      const { data, error } =
        await supabase.functions.invoke(
          "marshall-document-flow",
          {
            body: {
              action: "details",
              token,
            },
          }
        );

      if (error || !data?.ok) {
        setStatus("error");
        setMessage(
          data?.error ||
            "This secure request could not be opened."
        );
        setLoadingRequest(false);
        return;
      }

      setDocumentName(
        data.documentName || "Requested Document"
      );

      setRequestMessage(
        data.requestMessage || ""
      );

      setOutgoingFilename(
        data.outgoingFilename || ""
      );

      setOutgoingUrl(
        data.outgoingUrl || ""
      );

      setLoadingRequest(false);
    }

    loadRequest();
  }, [token]);

  async function uploadDocument() {
    if (!token || !file) return;

    setStatus("uploading");
    setMessage("");

    try {
      const { data: accessData, error: accessError } =
        await supabase.functions.invoke(
          "marshall-document-flow",
          {
            body: {
              action: "access",
              token,
              filename: file.name,
              mimeType: file.type,
              fileSize: file.size,
            },
          }
        );

      if (accessError) throw accessError;

      if (!accessData?.ok) {
        throw new Error(
          accessData?.error ||
            "This upload link could not be used."
        );
      }

      const { error: uploadError } =
        await supabase.storage
          .from("marshall-case-documents")
          .uploadToSignedUrl(
            accessData.storagePath,
            accessData.signedToken,
            file,
            {
              contentType:
                file.type || undefined,
            }
          );

      if (uploadError) throw uploadError;

      const {
        data: completeData,
        error: completeError,
      } = await supabase.functions.invoke(
        "marshall-document-flow",
        {
          body: {
            action: "complete",
            token,
            storagePath:
              accessData.storagePath,
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size,
          },
        }
      );

      if (completeError) throw completeError;

      if (!completeData?.ok) {
        throw new Error(
          completeData?.error ||
            "Upload could not be completed."
        );
      }

      setStatus("complete");
    } catch (error) {
      console.error(error);

      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Document upload failed."
      );
    }
  }

  if (loadingRequest) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-5 py-12 text-white">
        <div className="mx-auto max-w-xl text-white/60">
          Opening secure request...
        </div>
      </main>
    );
  }

  if (status === "complete") {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-5 py-12 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#111] p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c99a45] text-black">
            <Check
              size={28}
              strokeWidth={3}
            />
          </div>

          <div className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-[#c99a45]">
            Document Received
          </div>

          <h1 className="mt-3 text-3xl font-black">
            Thank you.
          </h1>

          <p className="mt-4 leading-7 text-white/60">
            Your {documentName} was securely delivered
            to Marshall Rosenbach&apos;s office and
            attached to your case.
          </p>

          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-5">
            <ShieldCheck
              size={22}
              className="text-[#c99a45]"
            />

            <div>
              <div className="font-bold">
                Secure upload complete
              </div>

              <div className="text-sm text-white/45">
                You may close this page.
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-5 py-10 text-white">
      <div className="mx-auto max-w-xl">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-[#c99a45]">
          Law Offices of
        </div>

        <div className="mt-1 text-xl font-black">
          Marshall E. Rosenbach
        </div>

        <div className="mt-7 rounded-3xl border border-white/10 bg-[#111] p-7">
          <FileUp
            size={28}
            className="text-[#c99a45]"
          />

          <div className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-[#c99a45]">
            Secure Document Request
          </div>

          <h1 className="mt-3 text-3xl font-black">
            {documentName}
          </h1>

          {requestMessage && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5 text-sm leading-6 text-white/70">
              {requestMessage}
            </div>
          )}

          {outgoingUrl && (
            <a
              href={outgoingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#c99a45]/25 bg-[#c99a45]/10 p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText
                  size={22}
                  className="shrink-0 text-[#c99a45]"
                />

                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-[0.1em] text-white/35">
                    File From Marshall
                  </div>

                  <div className="mt-1 truncate font-bold">
                    {outgoingFilename}
                  </div>
                </div>
              </div>

              <Download
                size={20}
                className="shrink-0 text-[#c99a45]"
              />
            </a>
          )}

          <div className="mt-7 border-t border-white/10 pt-6">
            <div className="text-xs font-black uppercase tracking-[0.12em] text-white/40">
              Upload Your Document
            </div>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={(event) => {
                setFile(
                  event.target.files?.[0] ||
                    null
                );

                setStatus("idle");
                setMessage("");
              }}
              className="mt-3 block w-full rounded-xl border border-white/10 bg-black/30 p-4"
            />

            {file && (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4 text-sm">
                {file.name}
              </div>
            )}

            {message && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {message}
              </div>
            )}

            <button
              type="button"
              disabled={
                !file ||
                status === "uploading"
              }
              onClick={uploadDocument}
              className="mt-6 min-h-14 w-full rounded-xl bg-[#c99a45] px-5 font-black uppercase text-black disabled:opacity-40"
            >
              {status === "uploading"
                ? "Uploading..."
                : "Upload Document"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
