import { useEffect, useState } from "react";

export type NotificationItem = {
id: string;
title: string;
message?: string;
icon?: string;
};

type Props = {
notifications: NotificationItem[];
duration?: number;
};

export default function NotificationCenter({
notifications,
duration = 6000,
}: Props) {
const [visible, setVisible] = useState<NotificationItem[]>([]);

useEffect(() => {
notifications.forEach((notification) => {
const alreadyVisible = visible.some(
(item) => item.id === notification.id
);

```
  if (alreadyVisible) return;

  setVisible((current) => [...current, notification]);

  setTimeout(() => {
    setVisible((current) =>
      current.filter((item) => item.id !== notification.id)
    );
  }, duration);
});
```

}, [notifications]);

return ( <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex w-[320px] flex-col gap-3">
{visible.map((notification) => ( <div
       key={notification.id}
       className="animate-[slideIn_.25s_ease-out] rounded-2xl border border-emerald-300/20 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur"
     > <div className="flex items-start gap-3"> <div className="text-2xl">
{notification.icon || "🔔"} </div>

```
        <div className="flex-1">
          <p className="text-sm font-black text-white">
            {notification.title}
          </p>

          {notification.message && (
            <p className="mt-1 text-xs text-neutral-300">
              {notification.message}
            </p>
          )}
        </div>
      </div>
    </div>
  ))}

  <style>{`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</div>
```

);
}
