import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function StudentsAdmin() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [studentMessage, setStudentMessage] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("static").select("*").order("name");
      if (!error && data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const allStudents = categories.map((cat) => (cat.students || []).map((s, idx) => ({ ...s, categoryName: cat.name, categoryId: cat.id, index: idx }))).flat();

    if (!searchQuery) {
      setFilteredStudents(allStudents);
    } else {
      setFilteredStudents(allStudents.filter((s) => `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery, categories]);

  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    if (!studentFirstName || !studentLastName || !studentGroup || !selectedCategoryId) {
      setStudentMessage("Barcha maydonlarni to‘ldiring!");
      return;
    }
    setStudentLoading(true);

    const { data: categoryData, error } = await supabase.from("static").select("students").eq("id", selectedCategoryId).single();

    if (error) {
      setStudentMessage("Xatolik yuz berdi!");
      setStudentLoading(false);
      return;
    }

    let updatedStudents = [...(categoryData.students || [])];

    if (editingIndex !== null) {
      updatedStudents[editingIndex] = { first_name: studentFirstName, last_name: studentLastName, group_name: studentGroup };
    } else {
      updatedStudents.push({ first_name: studentFirstName, last_name: studentLastName, group_name: studentGroup });
    }

    const { error: updateError } = await supabase.from("static").update({ students: updatedStudents }).eq("id", selectedCategoryId);

    if (!updateError) {
      setStudentMessage(editingIndex !== null ? "O‘quvchi yangilandi!" : "O‘quvchi qo‘shildi!");
      setCategories((prev) => prev.map((cat) => (cat.id === selectedCategoryId ? { ...cat, students: updatedStudents } : cat)));
      setStudentFirstName("");
      setStudentLastName("");
      setStudentGroup("");
      setEditingIndex(null);
    } else {
      setStudentMessage("Xatolik yuz berdi!");
    }

    setStudentLoading(false);
  };

  const handleDeleteStudent = async (categoryId, index) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const updatedStudents = [...(category.students || [])];
    updatedStudents.splice(index, 1);

    const { error } = await supabase.from("static").update({ students: updatedStudents }).eq("id", categoryId);
    if (!error) {
      setCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, students: updatedStudents } : cat)));
    }
  };

  const handleEditStudent = (categoryId, index) => {
    const student = categories.find((c) => c.id === categoryId)?.students?.[index];
    if (!student) return;
    setSelectedCategoryId(categoryId);
    setStudentFirstName(student.first_name);
    setStudentLastName(student.last_name);
    setStudentGroup(student.group_name);
    setEditingIndex(index);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex-1 max-w-xl bg-base-100 shadow card p-6 flex flex-col">
        <h2 className="card-title mb-4 text-center">{editingIndex !== null ? "O‘quvchini tahrirlash" : "O‘quvchi qo‘shish"}</h2>
        {studentMessage && <p className="text-green-600 text-center mb-3">{studentMessage}</p>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmitStudent}>
          <select className="select w-full" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
            <option value="">Kategoriya tanlang</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input type="text" placeholder="Ism" className="input w-full" value={studentFirstName} onChange={(e) => setStudentFirstName(e.target.value)} />
          <input type="text" placeholder="Familiya" className="input w-full" value={studentLastName} onChange={(e) => setStudentLastName(e.target.value)} />
          <input type="text" placeholder="Guruh" className="input w-full" value={studentGroup} onChange={(e) => setStudentGroup(e.target.value)} />
          <button type="submit" className="btn btn-primary flex items-center justify-center gap-2">
            {studentLoading && <span className="loading loading-spinner"></span>}
            {editingIndex !== null ? "Yangilash" : "Qo‘shish"}
          </button>
        </form>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <input ref={searchRef} type="text" className="input grow" placeholder="Ism yoki familiya bo‘yicha qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </div>
        <div className="overflow-y-auto h-[448px] space-y-4 p-0.5 pr-1.5">
          {categories.length === 0 ? (
            // Skeleton loader xuddi admin sahifadagi kabi
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-base-100 shadow rounded-lg p-4 flex justify-between items-center animate-pulse">
                <div className="pr-4 w-full">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student, idx) => (
              <div key={`${student.categoryId}-${idx}`} className="bg-base-100 shadow transition-shadow duration-300 hover:shadow-md rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">
                    {student.first_name} {student.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {student.group_name} — {student.categoryName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-circle btn-ghost" onClick={() => handleEditStudent(student.categoryId, student.index)}>
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button className="btn btn-circle btn-ghost" onClick={() => handleDeleteStudent(student.categoryId, student.index)}>
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Ro‘yxat bo‘sh</p>
          )}
        </div>
      </div>
    </div>
  );
}
