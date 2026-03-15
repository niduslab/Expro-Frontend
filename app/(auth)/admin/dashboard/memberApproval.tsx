import {
  CheckCircle,
  ChevronRight,
  CircleCheck,
  CircleX,
  Eye,
} from "lucide-react";
import { statusConfig } from "../wallet/recent-transactions";
import Image from "next/image";

type Status = "Approved" | "Pending" | "Rejected";

interface MemberApprovals {
  id: number;
  memberId: string;
  userName: string;
  userNumber: string;
  userImageLink: string;
  package: string;
  referred_by: string;
  amount: number;
  date: string;
  status: Status;
}

const memberapprovals: MemberApprovals[] = [
  {
    id: 1,
    memberId: "EWF-1241",
    userName: "Md. Arif Hossain",
    userNumber: "01712-345678",
    userImageLink: "/images/dashboard/memberApproval/1.jpg",
    package: "Basic Pension",
    referred_by: "Kamal Hossain (PP)",
    amount: 300,
    date: "14 Feb 2026",
    status: "Pending",
  },
  {
    id: 2,
    memberId: "EWF-1242",
    userName: "Nasreen Akter",
    userNumber: "01819-876543",
    userImageLink: "/images/dashboard/memberApproval/2.jpg",
    package: "Standard Pension",
    referred_by: "Jamal Ahmed (EM)",
    amount: 500,
    date: "13 Feb 2026",
    status: "Approved",
  },
  {
    id: 3,
    memberId: "EWF-1244",
    userName: "Shakil Rahman",
    userNumber: "01556-987654",
    userImageLink: "/images/dashboard/memberApproval/3.jpg",
    package: "Premium Pension",
    referred_by: "Rahim Uddin (APP)",
    amount: 1500,
    date: "12 Feb 2026",
    status: "Pending",
  },
  {
    id: 4,
    memberId: "EWF-1245",
    userName: "Rezaul Karim",
    userNumber: "01812-654321",
    userImageLink: "/images/dashboard/memberApproval/4.jpg",
    package: "Advanced Pension",
    referred_by: "Nusrat Jahan (PP)",
    amount: 1000,
    date: "11 Feb 2026",
    status: "Approved",
  },
  {
    id: 5,
    memberId: "EWF-1246",
    userName: "Fatema Khatun",
    userNumber: "01912-345123",
    userImageLink: "/images/dashboard/memberApproval/5.jpg",
    package: "Basic Pension",
    referred_by: "Jamal Ahmed (EM)",
    amount: 300,
    date: "09 Feb 2026",
    status: "Rejected",
  },
];

export default function MemberApproval() {
  return (
    <>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className=" flex items-start justify-between flex-col sm:flex-row sm:items-center mb-5">
          <div className="mb-2">
            <h2 className=" font-semibold text-[24px] leading-[120%] tracking-[-0.01em] align-middle mb-0.5 sm:mb-2 text-[#030712]">
              Member Approvals
            </h2>
            <span className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
              Review and manage new member applications
            </span>
          </div>
          <div>
            <button className="flex items-center justify-between w-[151px] gap-2">
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] text-center text-[#068847]">
                View ALL Members
              </span>
              <ChevronRight className="text-[#068847]" size={16} />
            </button>
          </div>
        </div>
        <div className="border border-[#DEE3E7] rounded-2xl">
          <div className="w-full max-w-full overflow-x-auto scrollbar-thin">
            <table className="w-full table-auto whitespace-nowrap">
              <thead>
                <tr className="text-[#030712] bg-[#EBEDF066] border-b border-[#DEE3E7]">
                  <th className="text-left py-3 px-2 font-normal text-[14px]  leading-[150%] tracking-[-1%] align-middle">
                    Member Id
                  </th>
                  <th className=" text-left py-3 px-8 font-normal text-[14px]  leading-[150%] tracking-[-1%] align-middle">
                    Name
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Package
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Referred By
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Applied
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Status
                  </th>
                  <th className="text-center py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {memberapprovals.map((tx: MemberApprovals) => (
                  <tr
                    key={tx.id}
                    className=" rounded-2xl relative   border-b last:border-none border-[#F3F4F6] hover:bg-gray-50"
                  >
                    <td className="py-4 px-2 ">
                      <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#73808C]">
                        {tx.memberId}
                      </p>
                    </td>
                    <td className="py-4 px-8 sm:px-6">
                      <div className="flex items-center gap-3 ">
                        <div className="flex-shrink-0">
                          <Image
                            src={tx.userImageLink}
                            alt={tx.userName}
                            width={16}
                            height={16}
                            className="rounded-full object-cover w-8 h-8"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] text-[#030712]">
                            {tx.userName}
                          </p>
                          <p className="font-normal text-[12px] leading-[150%] tracking-[-1%] text-[#4A5565]">
                            {tx.userNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#030712]">
                          {tx.package}
                        </p>
                        <p className="font-normal text-[12px] leading-[150%] tracking-[-1%] align-middle text-[#4A5565]">
                          ৳ {tx.amount}/mo
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <p className="font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#73808C]">
                        {tx.referred_by}
                      </p>
                    </td>

                    <td className="py-4 px-2 ">
                      <p className="font-normal text-[14px] leading-[20px] tracking-0 align-middle text-[#73808C]">
                        {tx.date}
                      </p>
                    </td>

                    <td className="py-4 px-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-[12px] leading-[150%] tracking-[-1%] ${statusConfig[tx.status].style}`}
                      >
                        {statusConfig[tx.status].icon}
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-4 px-2 font-normal text-[14px] leading-[20px] tracking-0 align-middle ">
                      <div className="flex items-center gap-[16px] h-[16px]">
                        {tx.status !== "Approved" && (
                          <>
                            <CircleCheck className="text-[#29A36A] h-[16px] w-[16px]" />
                            <CircleX className="text-[#DC2828] h-[16px] w-[16px]" />
                          </>
                        )}
                        <Eye className="text-[#73808C] h-[16px] w-[16px]" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
