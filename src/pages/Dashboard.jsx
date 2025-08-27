import React, { useState, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ChevronLeft, ChevronRight, List, CalendarDays, User } from "lucide-react";

const Dashboard = ({ tasks = [], currentUser }) => {
  const [viewMode, setViewMode] = useState("day"); // "day" or "list"
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- Task filters ---
  const myTasks = useMemo(
    () => tasks.filter((t) => t.owner === currentUser.id),
    [tasks, currentUser]
  );
  const delegatedTasks = useMemo(
    () => tasks.filter((t) => t.delegatedTo === currentUser.id),
    [tasks, currentUser]
  );
  const meetings = useMemo(
    () => tasks.filter((t) => t.type === "meeting"),
    [tasks]
  );

  const filteredTasks =
    selectedTab === "my"
      ? myTasks
      : selectedTab === "delegated"
      ? delegatedTasks
      : selectedTab === "meetings"
      ? meetings
      : tasks;

  // --- Calendar Navigation ---
  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const prevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const resetToday = () => {
    setCurrentDate(new Date());
  };

  // --- Generate 7-day week range ---
  const getWeekDates = () => {
    const week = [];
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay()); // start on Sunday
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates();

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Dashboard</h2>

        <div className="flex items-center gap-2">
          <Button
            onClick={resetToday}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Today
          </Button>

          {/* Toggle View with Icons */}
          <Tabs
            value={viewMode}
            onValueChange={setViewMode}
            className="bg-gray-800 rounded-lg px-1"
          >
            <TabsList className="grid grid-cols-2 gap-1">
              <TabsTrigger
                value="day"
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  viewMode === "day" ? "bg-blue-600 text-white" : "text-gray-400"
                }`}
              >
                <CalendarDays size={16} /> Day
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400"
                }`}
              >
                <List size={16} /> List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Profile Circle */}
          <Button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2">
            <User size={18} />
          </Button>
        </div>
      </div>

      {/* Task Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedTab === "all" ? "default" : "secondary"}
          onClick={() => setSelectedTab("all")}
          className={selectedTab === "all" ? "bg-blue-600 text-white" : "bg-gray-700"}
        >
          All
        </Button>
        <Button
          variant={selectedTab === "my" ? "default" : "secondary"}
          onClick={() => setSelectedTab("my")}
          className={selectedTab === "my" ? "bg-blue-600 text-white" : "bg-gray-700"}
        >
          My Tasks
        </Button>
        <Button
          variant={selectedTab === "delegated" ? "default" : "secondary"}
          onClick={() => setSelectedTab("delegated")}
          className={selectedTab === "delegated" ? "bg-blue-600 text-white" : "bg-gray-700"}
        >
          Delegated Task
        </Button>
        <Button
          variant={selectedTab === "meetings" ? "default" : "secondary"}
          onClick={() => setSelectedTab("meetings")}
          className={selectedTab === "meetings" ? "bg-blue-600 text-white" : "bg-gray-700"}
        >
          Meetings
        </Button>
      </div>

      {/* Calendar */}
      <Card className="bg-gray-800 border border-gray-700 mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <Button onClick={prevDay} className="bg-gray-700 p-2 rounded-lg">
              <ChevronLeft size={16} />
            </Button>
            <h3 className="text-lg font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h3>
            <Button onClick={nextDay} className="bg-gray-700 p-2 rounded-lg">
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date) => {
              const isToday =
                date.toDateString() === new Date().toDateString();
              const isSelected =
                date.toDateString() === currentDate.toDateString();

              return (
                <div
                  key={date}
                  onClick={() => setCurrentDate(date)}
                  className={`p-2 rounded-lg text-center cursor-pointer ${
                    isSelected
                      ? "bg-red-600 text-white"
                      : isToday
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-sm">{date.getDate()}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day / List View */}
      {viewMode === "day" ? (
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Day Schedule - {currentDate.toDateString()}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {Array.from({ length: 24 }).map((_, hour) => {
                const hourTasks = filteredTasks.filter(
                  (t) =>
                    new Date(t.time).getHours() === hour &&
                    new Date(t.time).toDateString() === currentDate.toDateString()
                );
                return (
                  <div
                    key={hour}
                    className="border border-gray-600 rounded-lg p-2 flex justify-between"
                  >
                    <span>{hour.toString().padStart(2, "0")}:00</span>
                    <div>
                      {hourTasks.length > 0 ? (
                        hourTasks.map((task) => (
                          <span
                            key={task.id}
                            className="bg-blue-600 text-xs px-2 py-1 rounded-lg ml-2"
                          >
                            {task.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No tasks
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Task List</h3>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-600 rounded-lg p-2 mb-2 flex justify-between"
                >
                  <span>{task.title}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(task.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No tasks available</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
