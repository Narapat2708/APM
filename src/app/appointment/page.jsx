"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaDesktop, FaVideo, FaMapMarkerAlt } from "react-icons/fa"
import { BsMicrosoftTeams } from "react-icons/bs"

export default function Page() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  async function loadAppointments() {
    try {
      const res = await fetch("/api/appointments", { cache: "no-store" })
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadAppointments()
    window.addEventListener("focus", loadAppointments)
    return () => window.removeEventListener("focus", loadAppointments)
  }, [])

  const PROGRAMS = [
    { value: "Teams", icon: <BsMicrosoftTeams className="text-blue-500 shrink-0" /> },
    { value: "Anydesk", icon: <FaDesktop className="text-red-500 shrink-0" /> },
    { value: "Zoom", icon: <FaVideo className="text-sky-500 shrink-0" /> },
    { value: "Onsite", icon: <FaMapMarkerAlt className="text-green-500 shrink-0" /> },
  ]

  const STATUS_MAP = {
    pending: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
    cancel: "bg-red-100 text-red-700",
  }

  const STATUS_LABEL = {
    pending: "รอ",
    done: "เสร็จสิ้น",
    cancel: "ยกเลิก",
  }

  const getProgram = v => PROGRAMS.find(p => p.value === v)

  const filtered = useMemo(() => {
    if (!search) return items
    return items.filter(i =>
      Object.values(i).join(" ").toLowerCase().includes(search.toLowerCase())
    )
  }, [items, search])

  return (
    <div className="flex min-h-screen font-noto-thai">
      <div className="flex-1">
        <div
          className="min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.png')" }}
        >
          <div className="min-h-screen bg-black/40 p-6 space-y-6">

            {/* SEARCH */}
            <div className="flex justify-between items-center">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาการนัดหมาย"
                className="border px-3 py-2 rounded-md w-64 bg-white"
              />

              <Link
                href="/appointment/form"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                เพิ่มนัดหมาย
              </Link>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl bg-[#2D2B26]">
              <table className="w-full table-fixed text-left text-white">
                <thead className="bg-gradient-to-r from-purple-600 to-blue-500">
                  <tr>
                    <th className="px-4 py-3 w-22">วันที่</th>
                    <th className="px-4 py-3 w-14">เวลา</th>
                    <th className="px-4 py-3 w-30">ลูกค้า</th>
                    <th className="px-4 py-3 w-80">รายละเอียด</th>
                    <th className="px-4 py-3 w-28">โปรแกรม</th>
                    <th className="px-4 py-3 w-46">สถานที่</th>
                    <th className="px-4 py-3 w-45">ผู้เข้าร่วม</th>
                    <th className="px-4 py-3 w-15">สถานะ</th>
                    <th className="px-4 py-3 w-23">จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-400">
                        ไม่มีข้อมูล
                      </td>
                    </tr>
                  ) : (
                    filtered.map(item => (
                      <tr key={item.id} className="border-t border-white/10 align-top">

                        <td className="px-4 py-3 break-words">{item.date}</td>
                        <td className="px-4 py-3 break-words">{item.time}</td>

                        <td className="px-4 py-3 break-words whitespace-normal">
                          {item.customer || "-"}
                        </td>

                        <td className="px-4 py-3">
                          <div className="whitespace-pre-wrap break-words">{item.subject}</div>
                        </td>

                        {/* PROGRAM */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {getProgram(item.program)?.icon}
                            <span>{item.program}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3 break-words whitespace-normal text-gray-300">
                          {item.location || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {item.by && item.by.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.by.map((name, index) => (
                                <span key={name} className="px-2 py-1 bg-gray-700 rounded text-sm">
                                  {name}
                                </span>
                              ))}
                            </div>
                          ) : "-"}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${STATUS_MAP[item.status]}`}>
                            {STATUS_LABEL[item.status]}
                          </span>
                        </td>

                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => router.push(`/appointment/form?id=${item.id}`)}
                            className="p-2 bg-yellow-500/20 rounded hover:bg-yellow-500/30"
                            title="แก้ไข"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#fbbf24">
                              <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                            </svg>
                          </button>
                          <button
                            onClick={async () => {
                              await fetch(`/api/appointments?id=${item.id}`, {
                                method: "DELETE",
                              })
                              loadAppointments()
                            }}
                            className="p-2 bg-red-500/20 rounded hover:bg-red-500/30"
                            title="ลบ"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ef4444">
                              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg>
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
