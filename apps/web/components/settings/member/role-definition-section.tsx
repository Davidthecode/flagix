"use client";

import { Button } from "@flagix/ui/components/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ROLES_INFO } from "@/lib/constants";

export const RoleDefinitionsSection = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-lg border border-gray-200 bg-[#F4F4F5] p-5">
      <Button
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-base text-gray-800">
          View Access Control Role Definitions
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </Button>

      {isOpen && (
        <div className="mt-4 border-gray-200 border-t pt-4">
          <div className="grid grid-cols-1 gap-4">
            {ROLES_INFO.map((info) => (
              <div
                className="rounded-lg border border-gray-200 bg-white p-4"
                key={info.role}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`rounded-full px-3 py-1 font-bold text-xs capitalize ${info.tagColor}`}
                  >
                    {info.role.toLowerCase()}
                  </span>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>

                <p className="mt-2 border-gray-200 border-l-2 pl-2 text-gray-700 text-xs italic">
                  Access: {info.access}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
