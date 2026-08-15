import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type CaseRecord = {
  id: string;
  caseNumber: string;
  client: string;
  phone: string;
  email: string;
  caseType: string;
  status: string;
  nextAction: string;
  incidentDate: string;
  location: string;
  summary: string;
  injured?: string;
  treatment?: string;
  preferredContact?: string;
  bestContactTime?: string;
  internalNotes?: string;
  documents: {
    id?: string;
    name: string;
    status: string;
    storagePath?: string;
    originalFilename?: string;
    mimeType?: string;
    fileSize?: number;
    uploadedAt?: string;
  }[];
  timeline: { label: string; time: string }[];
};

const sampleCases: CaseRecord[] = [
  {
    id: "case-001",
    caseNumber: "MR-2026-001",
    client: "John Smith",
    phone: "(561) 555-0182",
    email: "john@example.com",
    caseType: "Car Accident",
    status: "New Review",
    nextAction: "Call client and review incident details",
    incidentDate: "August 12, 2026",
    location: "Palm Beach Gardens, FL",
    summary:
      "Client reports being struck from behind while stopped at a traffic light. Medical treatment was received the same day.",
    documents: [
      { name: "Case Review Intake", status: "Received" },
      { name: "Crash Report", status: "Needed" },
      { name: "Medical Records", status: "Needed" },
    ],
    timeline: [
      { label: "Case review submitted", time: "Today · 1:42 PM" },
      { label: "Case drawer created", time: "Today · 1:42 PM" },
    ],
  },
  {
    id: "case-002",
    caseNumber: "MR-2026-002",
    client: "Maria Lopez",
    phone: "(561) 555-0137",
    email: "maria@example.com",
    caseType: "Truck Accident",
    status: "Needs Follow-Up",
    nextAction: "Confirm treatment facility and insurance information",
    incidentDate: "August 9, 2026",
    location: "West Palm Beach, FL",
    summary:
      "Commercial vehicle collision. Client reports shoulder and back injuries and has begun treatment.",
    documents: [
      { name: "Case Review Intake", status: "Received" },
      { name: "Photos", status: "Received" },
      { name: "Insurance Information", status: "Needed" },
    ],
    timeline: [
      { label: "Case review submitted", time: "Yesterday · 4:18 PM" },
      { label: "Initial call attempted", time: "Yesterday · 5:02 PM" },
    ],
  },
  {
    id: "case-003",
    caseNumber: "MR-2026-003",
    client: "Robert Hayes",
    phone: "(310) 555-0194",
    email: "robert@example.com",
    caseType: "Motorcycle Accident",
    status: "Consultation",
    nextAction: "Review available records before consultation",
    incidentDate: "August 3, 2026",
    location: "Beverly Hills, CA",
    summary:
      "Motorcycle collision involving another vehicle changing lanes. Consultation scheduled.",
    documents: [
      { name: "Case Review Intake", status: "Received" },
      { name: "Crash Report", status: "Received" },
      { name: "Medical Records", status: "Received" },
    ],
    timeline: [
      { label: "Case review submitted", time: "Aug 10 · 9:16 AM" },
      { label: "Client contacted", time: "Aug 10 · 11:40 AM" },
      { label: "Consultation scheduled", time: "Aug 11 · 2:05 PM" },
    ],
  },
];

export default function MarshallRosenbachLiveBoard() {
  const [query, setQuery] = useState("");
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [activeCaseId, setActiveCaseId] = useState("");
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusDraft, setStatusDraft] = useState("");
  const [nextActionDraft, setNextActionDraft] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [savingField, setSavingField] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadCases() {
      setLoadingCases(true);
      setLoadError("");

      try {
        const { data: caseData, error: caseError } = await supabase
          .from("marshall_cases")
          .select("*")
          .order("created_at", { ascending: false });

        if (!alive) return;

        if (caseError) {
          throw caseError;
        }

        const rows = caseData || [];
        const caseIds = rows.map((row: any) => row.id);

        let truthRows: any[] = [];
        let documentRows: any[] = [];

        if (caseIds.length > 0) {
          const [
            { data: truthData, error: truthError },
            { data: documentData, error: documentError },
          ] = await Promise.all([
            supabase
              .from("marshall_case_truth_events")
              .select("case_id, event_label, created_at")
              .in("case_id", caseIds)
              .order("created_at", { ascending: true }),

            supabase
              .from("marshall_case_documents")
              .select(
                "id, case_id, document_name, status, storage_path, original_filename, mime_type, file_size, uploaded_at, created_at"
              )
              .in("case_id", caseIds)
              .order("created_at", { ascending: true }),
          ]);

          if (truthError) {
            console.error(
              "Could not load Marshall truth events:",
              truthError
            );
          } else {
            truthRows = truthData || [];
          }

          if (documentError) {
            console.error(
              "Could not load Marshall documents:",
              documentError
            );
          } else {
            documentRows = documentData || [];
          }
        }

        if (!alive) return;

        const mapped: CaseRecord[] = rows.map((row: any) => {
          const caseTruth = truthRows.filter(
            (event: any) => event.case_id === row.id
          );

          const caseDocuments = documentRows.filter(
            (document: any) => document.case_id === row.id
          );

          return {
            id: row.id,
            caseNumber: row.case_number,
            client: [row.client_first_name, row.client_last_name]
              .filter(Boolean)
              .join(" "),
            phone: row.client_phone || "",
            email: row.client_email || "",
            caseType: row.case_type || "Personal Injury",
            status:
              row.status === "new_review"
                ? "New Review"
                : String(row.status || "Open")
                    .replace(/_/g, " ")
                    .replace(
                      /\b\w/g,
                      (letter: string) => letter.toUpperCase()
                    ),
            nextAction:
              row.next_action || "Review case and contact client",
            incidentDate: row.incident_date
              ? new Date(
                  `${row.incident_date}T00:00:00`
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Not provided",
            location: row.incident_location || "Not provided",
            summary: row.incident_details || "",
            injured: row.injured || "Not provided",
            treatment: row.treatment || "Not provided",
            preferredContact:
              row.preferred_contact || "Not provided",
            bestContactTime:
              row.best_contact_time || "Not provided",
            internalNotes: row.internal_notes || "",

            documents: caseDocuments.map((document: any) => ({
              id: document.id,
              name: document.document_name,
              status:
                document.status === "received"
                  ? "Received"
                  : "Needed",
              storagePath: document.storage_path || "",
              originalFilename:
                document.original_filename || "",
              mimeType: document.mime_type || "",
              fileSize: document.file_size || 0,
              uploadedAt: document.uploaded_at || "",
            })),

            timeline: caseTruth.map((event: any) => ({
              label: event.event_label,
              time: new Date(
                event.created_at
              ).toLocaleString(),
            })),
          };
        });

        setCases(mapped);
        setActiveCaseId(mapped[0]?.id || "");
      } catch (error) {
        console.error("Could not load Marshall cases:", error);

        if (!alive) return;

        setLoadError("Could not load cases.");
        setCases([]);
        setActiveCaseId("");
      } finally {
        if (alive) {
          setLoadingCases(false);
        }
      }
    }

    loadCases();

    return () => {
      alive = false;
    };
  }, []);

  const filteredCases = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return cases;

    return cases.filter((item) =>
      [
        item.client,
        item.phone,
        item.caseNumber,
        item.caseType,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [cases, query]);

  const activeCase =
    cases.find((item) => item.id === activeCaseId);


  useEffect(() => {
    if (!activeCase) {
      setStatusDraft("");
      setNextActionDraft("");
      setNotesDraft("");
      return;
    }

    setStatusDraft(activeCase.status);
    setNextActionDraft(activeCase.nextAction);
    setNotesDraft(activeCase.internalNotes || "");
  }, [activeCase?.id]);

  const addTruthEvent = async (
    caseId: string,
    eventType: string,
    eventLabel: string,
    eventDetail = ""
  ) => {
    const { data, error } = await supabase
      .from("marshall_case_truth_events")
      .insert({
        case_id: caseId,
        event_type: eventType,
        event_label: eventLabel,
        event_detail: eventDetail || null,
        event_meta: {},
      })
      .select("event_label, created_at")
      .single();

    if (error) {
      console.error("Could not record Truth Chain event:", error);
      return null;
    }

    return data;
  };

  const saveCaseField = async (
    field: "status" | "next_action" | "internal_notes",
    value: string,
    eventType: string,
    eventLabel: string
  ) => {
    if (!activeCase || savingField) return;

    setSavingField(field);

    const databaseValue =
      field === "status"
        ? value.toLowerCase().replace(/[^a-z0-9]+/g, "_")
        : value.trim();

    const { error } = await supabase
      .from("marshall_cases")
      .update({
        [field]: databaseValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeCase.id);

    if (error) {
      console.error(`Could not save ${field}:`, error);
      alert("Could not save this change.");
      setSavingField("");
      return;
    }

    const truth = await addTruthEvent(
      activeCase.id,
      eventType,
      eventLabel,
      value.trim()
    );

    setCases((current) =>
      current.map((item) => {
        if (item.id !== activeCase.id) return item;

        return {
          ...item,
          ...(field === "status" ? { status: value } : {}),
          ...(field === "next_action"
            ? { nextAction: value.trim() }
            : {}),
          ...(field === "internal_notes"
            ? { internalNotes: value.trim() }
            : {}),
          ...(truth
            ? {
                timeline: [
                  ...item.timeline,
                  {
                    label: truth.event_label,
                    time: new Date(truth.created_at).toLocaleString(),
                  },
                ],
              }
            : {}),
        };
      })
    );

    setSavingField("");
  };

  const toggleDocumentStatus = async (
    document: { id?: string; name: string; status: string }
  ) => {
    if (!activeCase || !document.id || savingField) return;

    const nextStatus =
      document.status === "Received" ? "Needed" : "Received";

    setSavingField(`document-${document.id}`);

    const { error } = await supabase
      .from("marshall_case_documents")
      .update({
        status: nextStatus.toLowerCase(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", document.id)
      .eq("case_id", activeCase.id);

    if (error) {
      console.error("Could not update document:", error);
      alert("Could not update this document.");
      setSavingField("");
      return;
    }

    const truth = await addTruthEvent(
      activeCase.id,
      "document_status_changed",
      `${document.name} marked ${nextStatus}`,
      `${document.name}: ${nextStatus}`
    );

    setCases((current) =>
      current.map((item) =>
        item.id !== activeCase.id
          ? item
          : {
              ...item,
              documents: item.documents.map((existing) =>
                existing.id === document.id
                  ? { ...existing, status: nextStatus }
                  : existing
              ),
              ...(truth
                ? {
                    timeline: [
                      ...item.timeline,
                      {
                        label: truth.event_label,
                        time: new Date(truth.created_at).toLocaleString(),
                      },
                    ],
                  }
                : {}),
            }
      )
    );

    setSavingField("");
  };


  const uploadCaseDocument = async (
    document: {
      id?: string;
      name: string;
      status: string;
      storagePath?: string;
    },
    file: File
  ) => {
    if (!activeCase || !document.id || savingField) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, Word document, JPG, PNG, or WEBP file.");
      return;
    }

    const maxBytes = 20 * 1024 * 1024;

    if (file.size > maxBytes) {
      alert("This file is larger than the 20 MB limit.");
      return;
    }

    setSavingField(`upload-${document.id}`);

    try {
      const safeName =
        file.name.replace(/[^a-zA-Z0-9._-]/g, "-") || "document";

      const filePath =
        `${activeCase.id}/${document.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("marshall-case-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) throw uploadError;

      const uploadedAt = new Date().toISOString();

      const { error: metadataError } = await supabase
        .from("marshall_case_documents")
        .update({
          status: "received",
          storage_path: filePath,
          original_filename: file.name,
          mime_type: file.type || null,
          file_size: file.size,
          uploaded_at: uploadedAt,
          updated_at: uploadedAt,
        })
        .eq("id", document.id)
        .eq("case_id", activeCase.id);

      if (metadataError) {
        await supabase.storage
          .from("marshall-case-documents")
          .remove([filePath]);

        throw metadataError;
      }

      const oldStoragePath = document.storagePath;

      if (oldStoragePath && oldStoragePath !== filePath) {
        const { error: removeError } = await supabase.storage
          .from("marshall-case-documents")
          .remove([oldStoragePath]);

        if (removeError) {
          console.warn(
            "Replacement uploaded, but old file could not be removed:",
            removeError
          );
        }
      }

      const truth = await addTruthEvent(
        activeCase.id,
        oldStoragePath ? "document_replaced" : "document_uploaded",
        oldStoragePath
          ? `${document.name} replaced`
          : `${document.name} uploaded`,
        file.name
      );

      setCases((current) =>
        current.map((item) =>
          item.id !== activeCase.id
            ? item
            : {
                ...item,
                documents: item.documents.map((existing) =>
                  existing.id === document.id
                    ? {
                        ...existing,
                        status: "Received",
                        storagePath: filePath,
                        originalFilename: file.name,
                        mimeType: file.type,
                        fileSize: file.size,
                        uploadedAt,
                      }
                    : existing
                ),
                ...(truth
                  ? {
                      timeline: [
                        ...item.timeline,
                        {
                          label: truth.event_label,
                          time: new Date(
                            truth.created_at
                          ).toLocaleString(),
                        },
                      ],
                    }
                  : {}),
              }
        )
      );
    } catch (error) {
      console.error("Marshall document upload failed:", error);
      alert("The document could not be uploaded. Please try again.");
    } finally {
      setSavingField("");
    }
  };


  const chooseCaseDocument = (
    document: {
      id?: string;
      name: string;
      status: string;
      storagePath?: string;
    }
  ) => {
    if (!document.id) return;

    const picker = window.document.createElement("input");

    picker.type = "file";
    picker.accept =
      ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

    picker.onchange = async () => {
      const file = picker.files?.[0];

      if (!file) return;

      await uploadCaseDocument(document, file);
    };

    picker.click();
  };


  const viewCaseDocument = async (document: {
    storagePath?: string;
    name: string;
  }) => {
    if (!document.storagePath) {
      alert(`No uploaded file is attached to ${document.name} yet.`);
      return;
    }

    setSavingField(`view-${document.storagePath}`);

    try {
      const { data, error } = await supabase.storage
        .from("marshall-case-documents")
        .createSignedUrl(document.storagePath, 300);

      if (error) throw error;

      if (!data?.signedUrl) {
        throw new Error("No signed document URL was returned.");
      }

      window.open(
        data.signedUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error("Could not open Marshall document:", error);
      alert("The document could not be opened.");
    } finally {
      setSavingField("");
    }
  };


  const [requestComposerOpen, setRequestComposerOpen] =
    useState(false);

  const [requestDocumentId, setRequestDocumentId] =
    useState("");

  const [requestPhone, setRequestPhone] =
    useState("");

  const [requestMessage, setRequestMessage] =
    useState("");

  const [requestAttachment, setRequestAttachment] =
    useState<File | null>(null);


  const requestDocumentFromClient = (document: {
    id?: string;
    name: string;
    status: string;
  }) => {
    if (!activeCase || !document.id) return;

    setRequestDocumentId(document.id);
    setRequestPhone(activeCase.phone);

    setRequestMessage(
      `Please upload your ${document.name} using the secure link below.`
    );

    setRequestAttachment(null);
    setRequestComposerOpen(true);
  };


  const sendDocumentRequest = async () => {
    if (!activeCase || !requestDocumentId || savingField) {
      return;
    }

    const document = activeCase.documents.find(
      (item) => item.id === requestDocumentId
    );

    if (!document?.id) {
      window.alert("Choose what you need from the client.");
      return;
    }

    if (!requestPhone.trim()) {
      window.alert("Enter the client's phone number.");
      return;
    }

    setSavingField(`request-${document.id}`);

    let outgoingStoragePath = "";

    try {
      if (requestAttachment) {
        const safeName =
          requestAttachment.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
          ) || "document";

        outgoingStoragePath =
          `${activeCase.id}/request-attachments/${document.id}/${Date.now()}-${safeName}`;

        const { error: attachmentError } =
          await supabase.storage
            .from("marshall-case-documents")
            .upload(
              outgoingStoragePath,
              requestAttachment,
              {
                cacheControl: "3600",
                upsert: false,
                contentType:
                  requestAttachment.type || undefined,
              }
            );

        if (attachmentError) throw attachmentError;
      }

      const { data, error } =
        await supabase.functions.invoke(
          "marshall-document-flow",
          {
            body: {
              action: "request",
              caseId: activeCase.id,
              documentId: document.id,
              documentName: document.name,
              clientPhone: requestPhone.trim(),
              clientName: activeCase.client,
              caseNumber: activeCase.caseNumber,
              requestMessage: requestMessage.trim(),
              outgoingStoragePath,
              outgoingFilename:
                requestAttachment?.name || "",
            },
          }
        );

      if (error) throw error;

      if (!data?.ok || !data?.uploadUrl) {
        throw new Error(
          data?.error || "Document request failed."
        );
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Your session expired. Please sign in again.");
      }

      const smsMessage = [
        `Hello ${activeCase.client},`,
        "",
        "Marshall Rosenbach's office is requesting a document from you.",
        "",
        `Requested: ${document.name}`,
        requestMessage.trim(),
        "",
        "Open your secure request:",
        data.uploadUrl,
        "",
        `Reference: ${activeCase.caseNumber}`,
        "",
        "This private link expires in 7 days.",
      ]
        .filter(Boolean)
        .join("\n");

      const smsResponse = await fetch(
        "/api/marshall-document-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            to: requestPhone.trim(),
            message: smsMessage,
            secureLink: data.uploadUrl,
          }),
        }
      );

      const smsResponseText = await smsResponse.text();
      let smsData: {
        ok?: boolean;
        accepted?: boolean;
        error?: string;
      } | null = null;

      if (smsResponseText) {
        try {
          smsData = JSON.parse(smsResponseText);
        } catch {
          if (!smsResponse.ok) {
            throw new Error(
              `Text message service returned an unexpected error (${smsResponse.status}).`
            );
          }

          throw new Error(
            "Text message service returned an invalid response."
          );
        }
      }

      if (!smsResponse.ok || !smsData?.ok || !smsData?.accepted) {
        throw new Error(
          smsData?.error || "Text message could not be sent."
        );
      }

      await supabase
        .from("marshall_case_truth_events")
        .insert({
          case_id: activeCase.id,
          event_type: "document_requested",
          event_label: `${document.name} requested from client`,
          event_detail: `Secure request sent by text.`,
          event_meta: {
            document_id: document.id,
            channel: "sms",
          },
        });

      setCases((current) =>
        current.map((item) =>
          item.id !== activeCase.id
            ? item
            : {
                ...item,
                timeline: [
                  ...item.timeline,
                  {
                    label:
                      `${document.name} requested from client`,
                    time: new Date().toLocaleString(),
                  },
                ],
              }
        )
      );

      setRequestComposerOpen(false);
      setRequestAttachment(null);

      window.alert(
        `${document.name} request sent to ${activeCase.client}.`
      );
    } catch (error) {
      console.error("Marshall request failed:", error);

      if (outgoingStoragePath) {
        await supabase.storage
          .from("marshall-case-documents")
          .remove([outgoingStoragePath]);
      }

      window.alert(
        error instanceof Error
          ? error.message
          : "The request could not be sent."
      );
    } finally {
      setSavingField("");
    }
  };


  return (
    <main className="min-h-screen bg-[#0b0c0e] text-white">

      {/* REQUEST COMPOSER MODAL */}
      {requestComposerOpen && activeCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-8">

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-[#c99a45]">
                  Request From Client
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  What do you need?
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setRequestComposerOpen(false)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-black text-white/60"
              >
                CLOSE
              </button>
            </div>


            <label className="mt-6 block">
              <div className="text-xs font-black uppercase tracking-[0.1em] text-white/40">
                Document Needed
              </div>

              <select
                value={requestDocumentId}
                onChange={(event) => {
                  const id = event.target.value;

                  setRequestDocumentId(id);

                  const selected =
                    activeCase.documents.find(
                      (item) => item.id === id
                    );

                  if (selected) {
                    setRequestMessage(
                      `Please upload your ${selected.name} using the secure link below.`
                    );
                  }
                }}
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none focus:border-[#c99a45]"
              >
                {activeCase.documents
                  .filter((item) => item.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>


            <label className="mt-5 block">
              <div className="text-xs font-black uppercase tracking-[0.1em] text-white/40">
                Client Phone
              </div>

              <input
                type="tel"
                value={requestPhone}
                onChange={(event) =>
                  setRequestPhone(event.target.value)
                }
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none focus:border-[#c99a45]"
              />
            </label>


            <label className="mt-5 block">
              <div className="text-xs font-black uppercase tracking-[0.1em] text-white/40">
                Message To Client
              </div>

              <textarea
                rows={4}
                value={requestMessage}
                onChange={(event) =>
                  setRequestMessage(event.target.value)
                }
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none focus:border-[#c99a45]"
              />
            </label>


            <label className="mt-5 block">
              <div className="text-xs font-black uppercase tracking-[0.1em] text-white/40">
                Attach A File For The Client
              </div>

              <div className="mt-1 text-xs leading-5 text-white/35">
                Optional — use this if Marshall needs the client to review or sign a form.
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={(event) =>
                  setRequestAttachment(
                    event.target.files?.[0] || null
                  )
                }
                className="mt-3 block w-full rounded-xl border border-white/10 bg-black/30 p-4 text-sm"
              />

              {requestAttachment && (
                <div className="mt-2 text-sm font-bold text-[#e5c486]">
                  {requestAttachment.name}
                </div>
              )}
            </label>


            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setRequestComposerOpen(false)}
                className="min-h-12 flex-1 rounded-xl border border-white/10 px-4 text-sm font-black text-white/65"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={sendDocumentRequest}
                disabled={Boolean(savingField)}
                className="min-h-12 flex-[1.4] rounded-xl bg-[#c99a45] px-4 text-sm font-black uppercase tracking-[0.08em] text-black disabled:opacity-40"
              >
                {savingField.startsWith("request-")
                  ? "SENDING..."
                  : "SEND REQUEST"}
              </button>
            </div>

          </div>
        </div>
      )}

      <header className="border-b border-white/10 bg-[#101113]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 lg:px-7">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c99a45]">
              Live Board
            </div>
            <h1 className="mt-1 text-xl font-black tracking-[-0.02em]">
              Marshall E. Rosenbach
            </h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/55">
            Case Command Center
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-82px)] max-w-[1600px] lg:grid-cols-[350px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 bg-[#101113]">
          <div className="sticky top-0 p-4 lg:p-5">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
              />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, case #, phone..."
                className="h-13 w-full rounded-xl border border-white/10 bg-black/25 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#c99a45]"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-white/35">
                Active Cases
              </div>
              <div className="text-xs font-bold text-[#c99a45]">
                {filteredCases.length}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {filteredCases.map((item) => {
                const selected = item.id === activeCase?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveCaseId(item.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#c99a45]/60 bg-[#c99a45]/10"
                        : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-black">
                          {item.client}
                        </div>
                        <div className="mt-1 text-xs font-bold uppercase tracking-[0.11em] text-[#c99a45]">
                          {item.caseType}
                        </div>
                      </div>

                      <ChevronRight
                        size={18}
                        className={
                          selected ? "text-[#c99a45]" : "text-white/25"
                        }
                      />
                    </div>

                    <div className="mt-3 text-xs text-white/40">
                      {item.caseNumber}
                    </div>

                    <div className="mt-3 rounded-lg bg-black/20 px-3 py-2 text-xs font-semibold text-white/60">
                      {item.status}
                    </div>

                    <div className="mt-3 text-xs leading-5 text-white/45">
                      Next: {item.nextAction}
                    </div>
                  </button>
                );
              })}

              {loadingCases && (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-white/40">
                  Loading cases...
                </div>
              )}

              {!loadingCases && filteredCases.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-white/40">
                  {query ? "No cases match that search." : "No cases yet."}
                </div>
              )}

              {loadError && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200/70">
                  {loadError} Showing local sample cases.
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#0b0c0e]">
          {activeCase ? (
            <div className="mx-auto max-w-[1180px] px-5 py-6 lg:px-8 lg:py-8">
              <div className="rounded-3xl border border-white/10 bg-[#151618] shadow-2xl shadow-black/20">
                <div className="relative border-b border-white/10 p-6 lg:p-8">
                  <button
                    type="button"
                    onClick={() => setActiveCaseId("")}
                    aria-label="Close Work Drawer"
                    title="Close Work Drawer"
                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/45 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white lg:right-7 lg:top-7"
                  >
                    <X size={18} />
                  </button>

                  <div className="flex flex-col gap-5 pr-12 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-[#c99a45]">
                        Active Work Drawer
                      </div>

                      <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] lg:text-4xl">
                        {activeCase.client}
                      </h2>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-white/60">
                          {activeCase.caseNumber}
                        </span>
                        <span className="rounded-full border border-[#c99a45]/30 bg-[#c99a45]/10 px-3 py-1.5 font-bold text-[#e4bf7a]">
                          {activeCase.caseType}
                        </span>
                        <select
                          value={statusDraft}
                          disabled={Boolean(savingField)}
                          onChange={(event) => {
                            const value = event.target.value;
                            setStatusDraft(value);

                            saveCaseField(
                              "status",
                              value,
                              "status_changed",
                              `Status changed to ${value}`
                            );
                          }}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-white/70 outline-none focus:border-[#c99a45]"
                        >
                          <option>New Review</option>
                          <option>Needs Follow-Up</option>
                          <option>Contacted</option>
                          <option>Consultation</option>
                          <option>Case Decision</option>
                          <option>Active Case</option>
                          <option>Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[340px]">
                      <a
                        href={`tel:${activeCase.phone}`}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#c99a45] px-4 text-sm font-black text-black"
                      >
                        <Phone size={17} />
                        Call
                      </a>

                      <a
                        href={`mailto:${activeCase.email}`}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 text-sm font-black text-white"
                      >
                        <Mail size={17} />
                        Email
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-6 lg:grid-cols-2 lg:p-8">
                  <div className="lg:col-span-2 rounded-2xl border border-[#c99a45]/35 bg-[#c99a45]/10 p-5">
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-[#d9ad5d]">
                      Next Action
                    </div>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        value={nextActionDraft}
                        onChange={(event) =>
                          setNextActionDraft(event.target.value)
                        }
                        className="min-h-12 flex-1 rounded-xl border border-[#c99a45]/25 bg-black/20 px-4 text-base font-bold text-white outline-none focus:border-[#c99a45]"
                      />

                      <button
                        type="button"
                        disabled={
                          savingField === "next_action" ||
                          !nextActionDraft.trim() ||
                          nextActionDraft.trim() === activeCase.nextAction
                        }
                        onClick={() =>
                          saveCaseField(
                            "next_action",
                            nextActionDraft,
                            "next_action_updated",
                            "Next action updated"
                          )
                        }
                        className="min-h-12 rounded-xl bg-[#c99a45] px-5 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {savingField === "next_action"
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-white/35">
                      <UserRound size={16} />
                      Client
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="text-xs text-white/35">Phone</div>
                        <div className="mt-1 font-bold">
                          {activeCase.phone}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/35">Email</div>
                        <div className="mt-1 break-all font-bold">
                          {activeCase.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-white/35">
                      <CalendarDays size={16} />
                      Case Facts
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="text-xs text-white/35">
                          Incident Date
                        </div>
                        <div className="mt-1 font-bold">
                          {activeCase.incidentDate}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/35">Location</div>
                        <div className="mt-1 font-bold">
                          {activeCase.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/15 p-5">
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
                      What Happened
                    </div>

                    <p className="mt-4 max-w-4xl text-base leading-7 text-white/68">
                      {activeCase.summary}
                    </p>
                  </div>

                  <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/15 p-5">
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
                      Case Details
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
                        <div className="text-xs text-white/35">
                          Injured?
                        </div>
                        <div className="mt-1 font-bold">
                          {activeCase.injured || "Not provided"}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
                        <div className="text-xs text-white/35">
                          Preferred Contact
                        </div>
                        <div className="mt-1 font-bold">
                          {activeCase.preferredContact || "Not provided"}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
                        <div className="text-xs text-white/35">
                          Treatment
                        </div>
                        <div className="mt-1 font-bold leading-6">
                          {activeCase.treatment || "Not provided"}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
                        <div className="text-xs text-white/35">
                          Best Contact Time
                        </div>
                        <div className="mt-1 font-bold">
                          {activeCase.bestContactTime || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-white/35">
                        <FileText size={16} />
                        Documents & Paperwork
                      </div>

                      <span className="rounded-full border border-[#c99a45]/20 bg-[#c99a45]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#d9ad5d]">
                        Case Document Workflow
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Request missing paperwork from the client, attach documents
                      received another way, and keep every file tied to this case.
                    </p>

                    <div className="mt-5 space-y-3">
                      {activeCase.documents.map((document) => (
                        <div
                          key={document.name}
                          className="rounded-xl border border-white/8 bg-white/[0.025] p-4"
                        >
                          <div className="text-sm font-black">
                            {document.name}
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="text-white/35">
                              Status
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 font-black ${
                                document.status === "Received"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-amber-400/10 text-amber-300"
                              }`}
                            >
                              {document.status}
                            </span>
                          </div>

                          {document.originalFilename && (
                            <div className="mt-3 rounded-lg border border-white/8 bg-black/20 px-3 py-2">
                              <div className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30">
                                Attached File
                              </div>
                              <div className="mt-1 break-all text-xs font-semibold text-white/65">
                                {document.originalFilename}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {document.status === "Needed" ? (
                              <>
                                <button
                                  type="button"
                                  disabled={
                                    !document.id ||
                                    savingField === `request-${document.id}`
                                  }
                                  onClick={() =>
                                    requestDocumentFromClient(document)
                                  }
                                  className="min-h-10 rounded-lg bg-[#c99a45] px-3 text-xs font-black uppercase tracking-[0.07em] text-black transition hover:bg-[#ddb15f] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {savingField === `request-${document.id}`
                                    ? "Sending..."
                                    : "Request From Client"}
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    !document.id ||
                                    savingField === `upload-${document.id}`
                                  }
                                  onClick={() =>
                                    chooseCaseDocument(document)
                                  }
                                  className="min-h-10 rounded-lg border border-white/12 bg-white/[0.04] px-3 text-xs font-black uppercase tracking-[0.07em] text-white transition hover:border-[#c99a45]/50 hover:bg-[#c99a45]/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {savingField === `upload-${document.id}`
                                    ? "Uploading..."
                                    : "Attach File"}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  disabled={
                                    !document.storagePath ||
                                    savingField === `view-${document.storagePath}`
                                  }
                                  onClick={() =>
                                    viewCaseDocument(document)
                                  }
                                  className="min-h-10 rounded-lg bg-[#c99a45] px-3 text-xs font-black uppercase tracking-[0.07em] text-black transition hover:bg-[#ddb15f] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {savingField === `view-${document.storagePath}`
                                    ? "Opening..."
                                    : "View File"}
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    !document.id ||
                                    savingField === `upload-${document.id}`
                                  }
                                  onClick={() =>
                                    chooseCaseDocument(document)
                                  }
                                  className="min-h-10 rounded-lg border border-white/12 bg-white/[0.04] px-3 text-xs font-black uppercase tracking-[0.07em] text-white transition hover:border-[#c99a45]/50 hover:bg-[#c99a45]/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {savingField === `upload-${document.id}`
                                    ? "Uploading..."
                                    : "Replace File"}
                                </button>
                              </>
                            )}
                          </div>

                          <div className="mt-3 border-t border-white/8 pt-3">
                            <button
                              type="button"
                              disabled={
                                !document.id ||
                                savingField === `document-${document.id}`
                              }
                              onClick={() => toggleDocumentStatus(document)}
                              className="text-xs font-bold text-white/35 underline decoration-white/15 underline-offset-4 transition hover:text-white/65"
                            >
                              {savingField === `document-${document.id}`
                                ? "Saving..."
                                : document.status === "Received"
                                  ? "Change Status: Mark as Needed"
                                  : "Change Status: Mark as Received"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
                      Truth Chain
                    </div>

                    <div className="mt-5 space-y-4">
                      {activeCase.timeline.map((event, index) => (
                        <div key={`${event.label}-${event.time}`} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#c99a45]" />
                            {index < activeCase.timeline.length - 1 && (
                              <div className="mt-1 h-full min-h-8 w-px bg-white/10" />
                            )}
                          </div>

                          <div className="pb-2">
                            <div className="text-sm font-bold">
                              {event.label}
                            </div>
                            <div className="mt-1 text-xs text-white/35">
                              {event.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 rounded-2xl border border-dashed border-white/10 bg-black/10 p-5">
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
                      Notes
                    </div>
                    <textarea
                      rows={5}
                      value={notesDraft}
                      onChange={(event) =>
                        setNotesDraft(event.target.value)
                      }
                      placeholder="Case notes, follow-up details, reminders..."
                      className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#c99a45]"
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        disabled={
                          savingField === "internal_notes" ||
                          notesDraft.trim() ===
                            (activeCase.internalNotes || "")
                        }
                        onClick={() =>
                          saveCaseField(
                            "internal_notes",
                            notesDraft,
                            "notes_updated",
                            "Case notes updated"
                          )
                        }
                        className="min-h-11 rounded-xl bg-[#c99a45] px-5 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {savingField === "internal_notes"
                          ? "Saving..."
                          : "Save Notes"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[70vh] items-center justify-center px-6 text-center text-white/40">
              Select a case to open the Work Drawer.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}



