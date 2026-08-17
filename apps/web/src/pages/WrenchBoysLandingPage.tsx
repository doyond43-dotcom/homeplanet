import React, { useState } from "react";
import { addWrenchBoysJob } from "../lib/wrenchBoysDemoStore";

export default function WrenchBoysLandingPage() {
  const [step, setStep] = useState(1);

  const [issueChoice, setIssueChoice] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [locationChoice, setLocationChoice] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [receiptId, setReceiptId] = useState("");

  function handlePhoto(file: File | undefined) {
    if (!file) return;

    setPhotoName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  }

  async function startVoiceRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        setVoiceUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      alert("Microphone access was not available. You can type the problem instead.");
    }
  }

  function stopVoiceRecording() {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setMediaRecorder(null);
    setIsRecording(false);
  }

  function submitRequest() {
    if (!phone.trim()) return;

    const service =
      issueChoice ||
      (issueDescription.trim() ? "Other / Customer Description" : "Service Request");

    const vehicle =
      vehicleDetails.trim() ||
      vehicleType ||
      "Vehicle";

    const messageParts = [
      issueDescription.trim(),
      issueChoice,
      locationChoice ? `Location: ${locationChoice}` : "",
      vehicleType ? `Type: ${vehicleType}` : "",
    ].filter(Boolean);

    const row = addWrenchBoysJob({
      name: customerName.trim() || "New Customer",
      phone: phone.trim(),
      vehicle,
      service,
      location: locationChoice || "Not specified",
      message: messageParts.join(" • "),
      customerReported: issueDescription.trim() || issueChoice,
      contactMethod,
    });

    setReceiptId(row.payload?.receipt_id || row.id);
    setSubmitted(true);
  }

  function resetIntake() {
    setStep(1);
    setIssueChoice("");
    setIssueDescription("");
    setLocationChoice("");
    setVehicleType("");
    setContactMethod("");
    setPhotoPreview("");
    setPhotoName("");
    setVoiceUrl("");
    setMediaRecorder(null);
    setIsRecording(false);
    setCustomerName("");
    setVehicleDetails("");
    setPhone("");
    setSubmitted(false);
    setReceiptId("");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center text-center px-6"
        style={{
          backgroundImage:
            "url('/images/wrench_boys_tow_truck_at_sunset.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-wide">
            WRENCH BOYS
          </h1>

          <p className="text-xl md:text-2xl text-orange-500 font-bold mt-2">
            AUTO & DIESEL
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mt-8">
            KEEPING OKEECHOBEE MOVING
          </h2>

          <p className="mt-6 text-lg text-zinc-300">
            Mobile Auto & Diesel Repair
          </p>

          <p className="mt-2 text-zinc-400">
            Preventative Maintenance • Roadside Service • Fleet Support
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={() => {
                document
                  .getElementById("intake")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-4 rounded-xl"
            >
              STUCK?
            </button>

            <button className="border border-white px-8 py-4 rounded-xl">
              CALL NOW
            </button>
          </div>
        </div>
      </section>

      {/* INTAKE FLOW */}
      <section id="intake" className="pt-14 pb-12 px-6">
        <div className="max-w-6xl mx-auto">

          {submitted ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-orange-500/30 bg-zinc-950 p-7 md:p-10 text-center">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                Request Received
              </div>

              <h2 className="mt-3 text-4xl md:text-5xl font-black">
                WE GOT IT.
              </h2>

              <p className="mt-4 text-zinc-400 leading-7">
                Your request has been sent into the Wrench Boys service board.
                The shop can now review it and move it through the repair process.
              </p>

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-black p-4">
                <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                  Request Number
                </div>
                <div className="mt-1 font-black text-orange-400">
                  {receiptId}
                </div>
              </div>

              <button
                type="button"
                onClick={resetIntake}
                className="mt-6 w-full rounded-xl border border-zinc-700 px-5 py-3 font-black hover:border-orange-500/60"
              >
                SEND ANOTHER REQUEST
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <>
                  <h2 className="text-5xl font-black text-center mb-16">
                    WHAT'S GOING ON?
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      "WON'T START",
                      "MAKING NOISE",
                      "CHECK ENGINE",
                      "STRANDED",
                      "SERVICE",
                      "OTHER",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setIssueChoice(item);
                          if (item !== "OTHER") setStep(2);
                        }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center hover:border-orange-500 transition"
                      >
                        <h3 className="text-xl font-bold">{item}</h3>
                      </button>
                    ))}
                  </div>

                  <div className="max-w-6xl mx-auto mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-black">
                      TELL US WHAT'S HAPPENING
                    </h3>

                    <p className="text-zinc-400 mt-1.5 mb-4">
                      Don't see it above? Describe what the vehicle is doing,
                      what you're hearing, or anything else we should know.
                    </p>

                    <textarea
                      rows={3}
                      value={issueDescription}
                      onChange={(event) =>
                        setIssueDescription(event.target.value)
                      }
                      placeholder="Example: Truck shakes around 55 mph and the check engine light came on yesterday."
                      className="w-full resize-none rounded-xl bg-black border border-zinc-700 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 min-h-[96px]"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        if (!issueChoice) {
                          setIssueChoice("OTHER");
                        }
                        setStep(2);
                      }}
                      className="w-full mt-4 bg-orange-500 hover:bg-orange-400 text-black font-black p-4 rounded-xl transition"
                    >
                      CONTINUE
                    </button>
                  </div>
                </>
              )}

              {step > 1 && issueChoice ? (
                <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-orange-500/25 bg-orange-500/5 px-5 py-4 text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    Selected Request
                  </div>
                  <div className="mt-1 font-black text-orange-400">
                    {issueChoice}
                  </div>
                </div>
              ) : null}

              {step === 2 && (
                <>
                  <h2 className="text-5xl font-black text-center mb-16">
                    WHERE'S IT AT?
                  </h2>

                  <div className="grid md:grid-cols-5 gap-6">
                    {["HOME", "WORK", "FARM", "ROADSIDE", "OTHER"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setLocationChoice(item);
                            setStep(3);
                          }}
                          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-5xl font-black text-center mb-16">
                    WHAT ARE WE LOOKING AT?
                  </h2>

                  <div className="grid md:grid-cols-4 gap-6">
                    {["CAR", "TRUCK", "DIESEL", "EQUIPMENT"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setVehicleType(item);
                          setStep(4);
                        }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-5xl font-black text-center mb-6">
                    SHOW US
                  </h2>

                  <p className="text-center text-zinc-400 mb-10">
                    Pick the easiest way to show us what is happening.
                  </p>

                  {!contactMethod ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      <button
                        type="button"
                        onClick={() => setContactMethod("SNAP A PHOTO")}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                      >
                        SNAP A PHOTO
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod("LEAVE A VOICE MESSAGE")}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                      >
                        LEAVE A VOICE MESSAGE
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod("TYPE IT OUT")}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                      >
                        TYPE IT OUT
                      </button>
                    </div>
                  ) : null}

                  {contactMethod === "SNAP A PHOTO" ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-orange-500/25 bg-zinc-950 p-6">
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                        Snap A Photo
                      </div>

                      <p className="mt-2 text-zinc-400">
                        Take a picture or choose one from your phone.
                      </p>

                      <label className="mt-5 block cursor-pointer rounded-xl bg-orange-500 p-4 text-center font-black text-black hover:bg-orange-400">
                        TAKE OR CHOOSE PHOTO
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(event) => handlePhoto(event.target.files?.[0])}
                        />
                      </label>

                      {photoPreview ? (
                        <div className="mt-5">
                          <img
                            src={photoPreview}
                            alt="Customer vehicle upload"
                            className="max-h-72 w-full rounded-xl border border-zinc-800 object-cover"
                          />
                          <div className="mt-2 text-xs text-zinc-500">{photoName}</div>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        disabled={!photoPreview}
                        onClick={() => setStep(5)}
                        className="mt-5 w-full rounded-xl bg-orange-500 p-4 font-black text-black disabled:opacity-40"
                      >
                        CONTINUE
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod("")}
                        className="mt-3 w-full rounded-xl border border-zinc-800 p-3 text-sm font-bold text-zinc-400"
                      >
                        CHOOSE ANOTHER WAY
                      </button>
                    </div>
                  ) : null}

                  {contactMethod === "LEAVE A VOICE MESSAGE" ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-orange-500/25 bg-zinc-950 p-6">
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                        Voice Message
                      </div>

                      <p className="mt-2 text-zinc-400">
                        Tell us what the vehicle is doing in your own words.
                      </p>

                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          className="mt-5 w-full rounded-xl bg-orange-500 p-4 font-black text-black"
                        >
                          START RECORDING
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopVoiceRecording}
                          className="mt-5 w-full rounded-xl bg-red-500 p-4 font-black text-white"
                        >
                          STOP RECORDING
                        </button>
                      )}

                      {voiceUrl ? (
                        <audio controls src={voiceUrl} className="mt-5 w-full" />
                      ) : null}

                      <button
                        type="button"
                        disabled={!voiceUrl}
                        onClick={() => setStep(5)}
                        className="mt-5 w-full rounded-xl bg-orange-500 p-4 font-black text-black disabled:opacity-40"
                      >
                        CONTINUE
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod("")}
                        className="mt-3 w-full rounded-xl border border-zinc-800 p-3 text-sm font-bold text-zinc-400"
                      >
                        CHOOSE ANOTHER WAY
                      </button>
                    </div>
                  ) : null}

                  {contactMethod === "TYPE IT OUT" ? (
                    <div className="mx-auto max-w-xl rounded-2xl border border-orange-500/25 bg-zinc-950 p-6">
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                        Type It Out
                      </div>

                      <p className="mt-2 text-zinc-400">
                        Tell us exactly what you are seeing, hearing, or feeling.
                      </p>

                      <textarea
                        rows={5}
                        value={issueDescription}
                        onChange={(event) => setIssueDescription(event.target.value)}
                        placeholder="Example: It started shaking, lost power, and now it will not restart."
                        className="mt-5 min-h-[140px] w-full resize-none rounded-xl border border-zinc-700 bg-black p-4 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none"
                      />

                      <button
                        type="button"
                        disabled={!issueDescription.trim()}
                        onClick={() => setStep(5)}
                        className="mt-4 w-full rounded-xl bg-orange-500 p-4 font-black text-black disabled:opacity-40"
                      >
                        CONTINUE
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod("")}
                        className="mt-3 w-full rounded-xl border border-zinc-800 p-3 text-sm font-bold text-zinc-400"
                      >
                        CHOOSE ANOTHER WAY
                      </button>
                    </div>
                  ) : null}
                </>
              )}

              {step === 5 && (
                <>
                  <h2 className="text-4xl md:text-5xl font-black text-center mb-10">
                    HOW DO WE REACH YOU?
                  </h2>

                  <div className="max-w-lg mx-auto space-y-4">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                      placeholder="Your Name"
                      className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-orange-500"
                    />

                    <input
                      type="text"
                      value={vehicleDetails}
                      onChange={(event) =>
                        setVehicleDetails(event.target.value)
                      }
                      placeholder="Year / Make / Model"
                      className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-orange-500"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="Phone Number"
                      className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-orange-500"
                    />

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
                      <div>
                        <span className="text-zinc-600">Need:</span>{" "}
                        {issueChoice || "Service Request"}
                      </div>

                      <div className="mt-1">
                        <span className="text-zinc-600">Location:</span>{" "}
                        {locationChoice || "Not specified"}
                      </div>

                      <div className="mt-1">
                        <span className="text-zinc-600">Vehicle:</span>{" "}
                        {vehicleDetails || vehicleType || "Not specified"}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!phone.trim()}
                      onClick={submitRequest}
                      className="w-full bg-orange-500 text-black font-black p-4 rounded-xl disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      SEND IT
                    </button>

                    {!phone.trim() ? (
                      <div className="text-center text-xs text-zinc-600">
                        Add a phone number to send the request.
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* KEEPING OKEECHOBEE MOVING */}
      <section className="py-14 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            KEEPING OKEECHOBEE MOVING
          </h2>

          <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Helping families. Helping work trucks. Helping businesses.
            Helping neighbors. Helping people stay ahead of breakdowns.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/images/glossy_orange_wb_racing_badge.webp"
            alt="Wrench Boys WB badge"
            className="w-16 h-16 mx-auto mb-4"
          />

          <h3 className="text-lg md:text-xl font-black">
            WRENCH BOYS AUTO & DIESEL
          </h3>

          <p className="text-sm text-zinc-400 mt-1">
            Keeping Okeechobee Moving
          </p>
        </div>
      </footer>
    </div>
  );
}

