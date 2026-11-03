import { createClient } from "@supabase/supabase-js";
import {
  createGuestReconnectCredential,
} from "./live-studio-session-crypto";
import {
  deriveGuestReconnectReplacement,
} from "./live-studio-reconnect-recovery";

export class GuestSessionError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "GuestSessionError";
  }
}

type Config = {
  supabaseUrl: string;
  serviceKey: string;
};

type SessionRecord = {
  session_id: string;
  meeting_id: string;
  meeting_room: string;
  guest_role: "viewer" | "participant";
  session_expires_at: string;
};

function client(config: Config) {
  if (!config.supabaseUrl || !config.serviceKey) {
    throw new GuestSessionError(
      "Guest session service unavailable",
      503
    );
  }

  return createClient(config.supabaseUrl, config.serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function validateRecord(data: unknown): SessionRecord {
  const record = Array.isArray(data) ? data[0] : null;

  if (
    !record ||
    typeof record.session_id !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(record.session_id) ||
    typeof record.meeting_id !== "string" ||
    typeof record.meeting_room !== "string" ||
    !/^hp-[0-9a-f-]{36}$/.test(record.meeting_room) ||
    (record.guest_role !== "viewer" &&
      record.guest_role !== "participant") ||
    typeof record.session_expires_at !== "string" ||
    !Number.isFinite(Date.parse(record.session_expires_at))
  ) {
    throw new GuestSessionError(
      "Guest session authorization unavailable",
      503
    );
  }

  return record as SessionRecord;
}

export async function claimGuestSession(
  config: Config,
  invitationHash: string
) {
  if (!/^[0-9a-f]{64}$/.test(invitationHash)) {
    throw new GuestSessionError("Invalid invitation", 403);
  }

  const reconnect = createGuestReconnectCredential();

  const { data, error } = await client(config).rpc(
    "live_studio_claim_guest_session",
    {
      p_token_hash: invitationHash,
      p_reconnect_hash: reconnect.hash,
    }
  );

  if (error) {
    if (error.message.includes("Invitation unavailable")) {
      throw new GuestSessionError("Invitation unavailable", 403);
    }

    throw new GuestSessionError(
      "Guest session service unavailable",
      503
    );
  }

  return {
    ...validateRecord(data),
    reconnectSecret: reconnect.secret,
  };
}

export async function rotateGuestSession(
  config: Config,
  currentSecret: unknown,
  recoveryKey: string
) {
  let credential;

  try {
    credential = deriveGuestReconnectReplacement(
      currentSecret,
      recoveryKey
    );
  } catch {
    throw new GuestSessionError(
      "Invalid or unavailable reconnect credential",
      403
    );
  }

  const { data, error } = await client(config).rpc(
    "live_studio_rotate_guest_reconnect_recoverable",
    {
      p_current_hash: credential.currentHash,
      p_next_hash: credential.replacementHash,
    }
  );

  if (error) {
    throw new GuestSessionError(
      "Guest reconnect service unavailable",
      503
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new GuestSessionError(
      "Reconnect session unavailable",
      403
    );
  }

  return {
    ...validateRecord(data),
    reconnectSecret: credential.replacementSecret,
  };
}
