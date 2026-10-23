import React from "react";
import { BriefcaseBusiness } from "lucide-react";

export default function Empty({ text }) {
  return (
    <div className="empty">
      <BriefcaseBusiness size={30} />
      <p>{text}</p>
    </div>
  );
}
