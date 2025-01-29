"use client";

import { useState, useMemo } from "react";
import useRecommendationData from "../../../../hooks/useRecommendationData";
import FoodCard from "../../../../components/FoodCard";

export default function StatPage({ params }) {
  const { id } = params;
  const { recData, loading, error } = useRecommendationData(id);
  const [timeFilter, setTimeFilter] = useState("all");
  const [openRecDate, setOpenRecDate] = useState(null);

  // กรอง Recommendation ตามเวลาที่เลือก
  const filteredData = useMemo(() => {
    if (!recData || !Array.isArray(recData)) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return recData.filter((rec) => {
      if (!rec || !rec.timeStamp) return false;
      const recDate = new Date(rec.timeStamp);
      switch (timeFilter) {
        case "today":
          return recDate >= today;
        case "week":
          return recDate >= thisWeek;
        case "month":
          return recDate >= thisMonth;
        default:
          return true;
      }
    });
  }, [recData, timeFilter]);

  if (loading) return <div>กำลังโหลด...</div>;
  if (!recData || !Array.isArray(recData) || recData.length === 0)
    return <div>ไม่มีประวัติ</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("th-TH", options);
  };

  // ฟังก์ชันสำหรับจัดกลุ่มข้อมูลตามวันที่
  const groupByDate = (data) => {
    return data.reduce((acc, rec) => {
      const date = formatDate(rec.timeStamp);
      if (!acc[date]) acc[date] = []; // สร้างกลุ่มวันที่ใหม่หากยังไม่มี
      acc[date].push(rec);
      return acc;
    }, {});
  };

  // ฟังก์ชันสำหรับเปิด/ปิดวันที่
  const toggleDate = (date) => {
    setOpenRecDate(openRecDate === date ? null : date);
  };

  // เช็คสถานะการโหลด ข้อผิดพลาด และข้อมูล
  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;
  if (!recData || !Array.isArray(recData))
    return <div>ไม่มีข้อมูลที่ถูกต้อง</div>;

  const groupedData = groupByDate(filteredData); // จัดกลุ่มข้อมูลที่กรองแล้ว

  return (
    <div className="flex justify-center min-h-screen pb-28">
      <div className="p-4 w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 pb-2">ประวัติการแนะนำอาหาร</h1>

        <div className="mb-6">
          <label htmlFor="timeFilter" className="text-lg font-medium mr-3">
            กรองตาม:
          </label>
          <select
            id="timeFilter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border rounded-lg p-2 bg-white shadow-sm"
          >
            <option value="all">ทั้งหมด</option>
            <option value="today">วันนี้</option>
            <option value="week">สัปดาห์นี้</option>
            <option value="month">เดือนนี้</option>
          </select>
        </div>

        {Object.keys(groupedData).length > 0 ? (
          Object.keys(groupedData).map((date) => (
            <div key={date} className="mb-8">
              <h3
                onClick={() => toggleDate(date)}
                className="text-xl font-semibold mb-4 pb-2 border-b-2 border-orange-500 cursor-pointer flex items-center"
              >
                <span>{date}</span>
                <span className="ml-2 text-gray-500">
                  {openRecDate === date ? "▼" : "▶"}
                </span>
              </h3>
              {openRecDate === date &&
                groupedData[date].map((rec) => (
                  <div
                    key={rec.id}
                    className="mb-6 bg-white rounded-lg p-4 shadow-sm"
                  >
                    <h4 className="text-lg font-medium mb-3 text-gray-700">
                      เวลา {formatTime(rec.timeStamp)}
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {rec.foodRecommendation &&
                      rec.foodRecommendation.length > 0 ? (
                        rec.foodRecommendation.map((data) => (
                          <div key={data.foodId} className="w-60">
                            <FoodCard food={data.food} />
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500">
                          ไม่มีคำแนะนำอาหารสำหรับรายการนี้
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            ไม่พบคำแนะนำสำหรับช่วงเวลาที่เลือก
          </div>
        )}
      </div>
    </div>
  );
}
