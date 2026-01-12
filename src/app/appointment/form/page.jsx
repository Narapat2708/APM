"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FaDesktop, FaVideo, FaMapMarkerAlt } from "react-icons/fa"
import { BsMicrosoftTeams } from "react-icons/bs"

export default function AppointmentFormPage() {
    const router = useRouter()
    const params = useSearchParams()
    const editId = params.get("id")

    const [form, setForm] = useState({
        date: "",
        time: "",
        customer: "",
        subject: "",
        program: "",
        location: "",
        by: [],
        status: "pending",
    })

    const PROGRAMS = [
        { value: "Teams", icon: <BsMicrosoftTeams className="text-blue-500" /> },
        { value: "Anydesk", icon: <FaDesktop className="text-red-500" /> },
        { value: "Zoom", icon: <FaVideo className="text-sky-500" /> },
        { value: "Onsite", icon: <FaMapMarkerAlt className="text-green-500" /> },
    ]

    const BY_OPTIONS = [
        "อัลฟาร์",
        "พี่กล้า",
        "พี่ยศ",
        "พี่เซน",
        "พี่ฟาติน",
        "พี่อ้อม",
        "พี่นัท",
        "พี่ต้น",
        "ฟิต",
        "ดีน",
    ]

    const dropdownRef = useRef(null)
    const [openProgram, setOpenProgram] = useState(false)

    const isOnsite = form.program === "Onsite"

    useEffect(() => {
        if (!editId) return

        async function loadDetail() {
            try {
                const res = await fetch(`/api/appointments?id=${editId}`)
                const data = await res.json()
                if (data) {
                    setForm(data)
                }
            } catch (err) {
                console.error(err)
            }
        }

        loadDetail()
    }, [editId])

    useEffect(() => {
        function onDoc(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenProgram(false)
            }
        }
        document.addEventListener("mousedown", onDoc)
        return () => document.removeEventListener("mousedown", onDoc)
    }, [])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    function toggleParticipant(name) {
        setForm(prev => ({
            ...prev,
            by: prev.by.includes(name)
                ? prev.by.filter(n => n !== name)
                : [...prev.by, name],
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.date || !form.subject.trim()) return

        await fetch("/api/appointments", {
            method: editId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                id: editId ? Number(editId) : undefined,
            }),
        })

        router.push("/appointment")
    }

    return (
        <div className="p-6 min-h-screen bg-[#111111] text-white font-noto-thai">
            <div className="max-w-3xl mx-auto bg-[#1A1A1A] rounded-2xl p-8">
                <h1 className="text-2xl mb-4">
                    {editId ? "แก้ไขนัดหมาย" : "เพิ่มนัดหมาย"}
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="block text-sm mb-1">วันที่</label>

                        <div
                            className="relative cursor-pointer"
                            onClick={() =>
                                document.getElementById("date-input")?.showPicker?.()}
                        >
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                                📅
                            </span>

                            <input
                                id="date-input"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 rounded-md bg-black/20 text-white appearance-none cursor-pointer"
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm mb-1">เวลา</label>
                        <div
                            className="relative cursor-pointer"
                            onClick={() => document.getElementById("time-input")?.showPicker?.()}
                        >
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                                ⏰
                            </span>

                            <input
                                id="time-input"
                                name="time"
                                type="time"
                                value={form.time}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 rounded-md bg-black/20 text-white appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm mb-1">ลูกค้า</label>
                        <input
                            name="customer"
                            value={form.customer}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-black/20 text-white"
                            placeholder="ชื่อลูกค้า / บริษัท"
                            required
                        />
                    </div>


                    <div className="md:col-span-2">
                        <label className="block text-sm mb-1">รายละเอียด</label>
                        <textarea
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="รายละเอียดการนัดหมาย"
                            className="w-full px-3 py-3 rounded-md bg-black/20 text-white min-h-[140px] resize-vertical outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">โปรแกรม</label>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setOpenProgram(v => !v)}
                                className="w-full px-3 py-2 rounded-md bg-black/20 flex items-center justify-between text-white"
                            >
                                <div className="flex items-center gap-2">
                                    {form.program ? (
                                        <>
                                            {PROGRAMS.find(p => p.value === form.program)?.icon}
                                            <span>{form.program}</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-300">เลือกโปรแกรม</span>
                                    )}
                                </div>
                                <span className="text-gray-400">▾</span>
                            </button>

                            {openProgram && (
                                <div className="absolute mt-1 w-full bg-white text-black rounded-md shadow z-50">
                                    {PROGRAMS.map(p => (
                                        <div
                                            key={p.value}
                                            onClick={() => {
                                                setForm(f => ({
                                                    ...f,
                                                    program: p.value,
                                                    location: p.value === "Onsite" ? f.location : "",
                                                }))
                                                setOpenProgram(false)
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {p.icon}
                                            <span>{p.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {form.program === "Onsite" && (
                        <div>
                            <label className="block text-sm mb-1">สถานที่</label>
                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="ชื่อสถานที่"
                                className="w-full px-3 py-2 rounded-md bg-black/20 text-white"
                            />
                        </div>
                    )}


                    <div className="md:col-span-2">
                        <label className="block text-sm mb-2">ผู้เข้าร่วม</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {BY_OPTIONS.map(name => (
                                <label
                                    key={name}
                                    className="flex items-center gap-2 p-2 rounded bg-black/10 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.by.includes(name)}
                                        onChange={() => toggleParticipant(name)}
                                        className="accent-indigo-500"
                                    />
                                    <span>{name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => router.push("/appointment")}
                            className="px-4 py-2 rounded-md border"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-md bg-gradient-to-r from-[#9b5dfb] to-[#6D5DFB] text-white"
                        >
                            {editId ? "อัปเดต" : "บันทึก"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
