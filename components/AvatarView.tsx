import React from "react";

export const AvatarView: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
      <div className="w-full flex flex-col items-center justify-center">
        {/* <div className="flex items-center justify-center gap-2 text-sm text-green-400 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Online
        </div> */}
        <div className="w-full flex items-center justify-center">
          <img
            src="/assets/riya1.png"
            alt="Riya's Avatar"
            className="w-full max-w-lg h-auto rounded-3xl shadow-2xl border-4 border-white/10"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
};
