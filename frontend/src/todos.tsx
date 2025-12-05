import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import NavBar from "./Burger.tsx";
import { ListX, CirclePlus, CircleChevronRight, CircleChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Priority = "Urgent" | "Average" | "Down";
type Status = "Not started" | "To do" | "In progress" | "Done";

type Todo = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  start_time: Date;
  due_time: Date;
  day: Date;
  status: Status;
  priority: Priority;
  user_id: number;
};

interface UserType {
    id: number;
    firstname: string;
    name: string;
    email: string;
    birthdate: string;
}

function AllTodos() {
  const [sortBy, setSortBy] = useState<"StartTime" | "EndTime" | "priority" | "title" | "status" | null>(null);
  const [sortAsc, setSortAsc] = useState(true); // true = croissant, false = décroissant



  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dayTime, setDayTime] = useState("");
  const [priority, setPriority] = useState<Priority>("Average");

  const [filter, setFilter] = useState<Priority | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [tomorrowFilter, setTomorrowFilter] = useState<Priority | "All">("All");
  const [tomorrowStatusFilter, setTomorrowStatusFilter] = useState<Status | "All">("All");

  const [showForm, setShowForm] = useState(false);

  const GET_TODOS_URL = "http://localhost:3000/user/todos";
  const POST_TODO_URL = "http://localhost:3000/todos";

                {/* Authentification */}
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(GET_TODOS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const dbTodos: Todo[] = data.map((t: any) => ({
          ...t,
          created_at: new Date(t.created_at),
          start_time: new Date(t.start_time),
          due_time: new Date(t.due_time),
          day: new Date(t.day),
        }));

        setTodos(dbTodos);
      } else {
        console.error("GET /user/todos non ok", await response.text());
      }
    } catch (error) {
      console.error("Erreur chargement todos", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!endTime || endTime < startTime) {
      setEndTime(startTime);
    }
  }, [startTime, endTime]);


  function getDayInfo(daysOffset: number) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const dayNumber = date.getDate();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "Julie",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayName = weekdays[date.getDay()];
    const monthName = months[date.getMonth()];
    return { dayNumber, dayName, monthName };
  }

  function isSameDay(date: Date, offset: number) {
    const target = new Date();
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + offset);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return d.getTime() === target.getTime();
  }

  function sortTodos(todos: Todo[]) {
    if (!sortBy) return todos;

    return [...todos].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortBy) {
        case "StartTime":
          aVal = a.start_time.getTime();
          bVal = b.start_time.getTime();
          break;
        case "EndTime":
          aVal = a.due_time.getTime();
          bVal = b.due_time.getTime();
          break;
        case "priority":
          const priorityMap = { "Urgent": 3, "Average": 2, "Down": 1 };
          aVal = priorityMap[a.priority];
          bVal = priorityMap[b.priority];
          break;
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "status":
          const statusMap = { "Not started": 1, "To do": 2, "In progress": 3, "Done": 4 };
          aVal = statusMap[a.status];
          bVal = statusMap[b.status];
          break;
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }



  const filteredTodos = sortTodos(
    todos
      .filter((todo) => isSameDay(todo.day, selectedOffset))
      .filter((todo) => {
        const priorityMatch = filter === "All" || todo.priority === filter;
        const statusMatch = statusFilter === "All" || todo.status === statusFilter;
        return priorityMatch && statusMatch;
      })
  );



  const tomorrowTodos = sortTodos(
    todos
      .filter((todo) => isSameDay(todo.day, selectedOffset + 1))
      .filter((todo) => {
        const priorityMatch = filter === "All" || todo.priority === filter;
        const statusMatch = statusFilter === "All" || todo.status === statusFilter;
        return priorityMatch && statusMatch;
      })
  );

  function updateTodoStatus(id: number, newStatus: Status) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, status: newStatus } : todo))
    );
  }

  function deleteTodo(id: number) {
        const updated = todos.filter(t => t.id !== id);
        setTodos(updated);
        localStorage.setItem("todos", JSON.stringify(updated));
    }


  const todayTodos = todos.filter((todo) => isSameDay(todo.day, 0));
  const TodaytotalCount = todayTodos.length;
  const TodayFinishedCount = todayTodos.filter((t) => t.status === "Done").length;
  const { monthName: selectedMonth } = getDayInfo(selectedOffset);

  const urgentCount = todayTodos.filter((t) => t.priority === "Urgent").length;
  const averageCount = todayTodos.filter((t) => t.priority === "Average").length;
  const downCount = todayTodos.filter((t) => t.priority === "Down").length;
  const totalCount = todayTodos.length;

  const NotStartedCount = todayTodos.filter((t) => t.status === "Not started").length;
  const TodoCount = todayTodos.filter((t) => t.status === "To do").length;
  const InprogressCount = todayTodos.filter((t) => t.status === "In progress").length;
  const FinishedCount = todayTodos.filter((t) => t.status === "Done").length;

  const tomorrowAllTodos = todos.filter((todo) => isSameDay(todo.day, selectedOffset + 1));

  const TomorowtotalCount = tomorrowAllTodos.length;
  const TomorowUrgentCount = tomorrowAllTodos.filter((t) => t.priority === "Urgent").length;
  const TomorowAverageCount = tomorrowAllTodos.filter((t) => t.priority === "Average").length;
  const TomorowDownCount = tomorrowAllTodos.filter((t) => t.priority === "Down").length;

  const TomorowNotStartedCount = tomorrowAllTodos.filter((t) => t.status === "Not started").length;
  const TomorowTodoCount = tomorrowAllTodos.filter((t) => t.status === "To do").length;
  const TomorowInprogressCount = tomorrowAllTodos.filter(
    (t) => t.status === "In progress"
  ).length;
  const TomorowFinishedCount = tomorrowAllTodos.filter((t) => t.status === "Done").length;

  const progress = totalCount > 0 ? (FinishedCount / totalCount) * 100 : 0;


  async function SaveTodotoDB(todoData: any) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(POST_TODO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        console.error("Erreur serveur POST /todos", await response.text());
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur réseau", error);
      return null;
    }
  }


  async function addTodo() {
    if (!user) {
      alert("Utilisateur non chargé");
      return;
    }

    if (
      input.trim() === "" ||
      description.trim() === "" ||
      startTime === "" ||
      endTime === "" ||
      dayTime === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (endTime < startTime) {
      alert("The end time cannot be less than the start time.");
      return;
    }

    const finalStartDate = new Date(`${dayTime}T${startTime}`);
    const finalDueDate = new Date(`${dayTime}T${endTime}`);
    const formatMySQL = (date: Date) =>
      date.toISOString().slice(0, 19).replace("T", " ");

    const newTodo = {
      title: input.trim(),
      description: description,
      due_time: formatMySQL(finalDueDate),
      day: formatMySQL(new Date(dayTime)),
      start_time: formatMySQL(finalStartDate),
      status: "To do" as Status,
      priority: priority,
      user_id: user.id,
    };

    const savedTodo = await SaveTodotoDB(newTodo);

    if (savedTodo) {
      const newTodoFormatted: Todo = {
        ...savedTodo,
        created_at: new Date(savedTodo.created_at),
        start_time: new Date(savedTodo.start_time),
        due_time: new Date(savedTodo.due_time),
        day: new Date(savedTodo.day),
      };

      setTodos((prev) => [newTodoFormatted, ...prev]);
      setInput("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setDayTime("");
      setPriority("Average");
      setShowForm(false);
    } else {
      alert("Erreur lors de la sauvegarde !");
    }
  }


  if (loading) {
    return <div className="w-full text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="overflow-x-hidden">
      <div className="w-full flex flex-wrap justify-center gap-10">
        <NavBar />
        <div className="flex flex-col items-center">
          <div className="w-3/4 flex items-center justify-center my-10 gap-10">
            <button
              className="btn btn-circle btn-md"
              onClick={() => setSelectedOffset((prev) => prev - 1)}
            >
              <CircleChevronLeft className="w-full h-full" />
            </button>
            <div className="flex flex-col">
              <div className="w-full flex justify-center mb-4">
                <span className="text-2xl font-bold">{selectedMonth}</span>
              </div>
              <div className="flex justify-center gap-20">
                {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                  const realOffset = selectedOffset + offset;
                  const { dayNumber, dayName } = getDayInfo(realOffset);
                  const isToday = realOffset === 0;
                  const isSelected = offset === 0;

                  return (
                    <div
                      key={realOffset}
                      className="flex flex-col items-center cursor-pointer w-10"
                      onClick={() => setSelectedOffset(realOffset)}
                    >
                      <div
                        className={`flex flex-col items-center justify-center rounded-full transition-all duration-300
                          ${isSelected
                            ? "w-16 h-16 text-2xl font-extrabold bg-primary text-primary-content"
                            : ""
                          }
                          ${!isSelected
                            ? "w-10 h-10 text-base bg-base-300"
                            : ""
                          }
                          ${isToday && !isSelected
                            ? "border-4 border-primary"
                            : ""
                          }
                      `}
                      >
                        <span>{dayNumber}</span>
                      </div>

                      <span
                        className={`mt-1 transition-all duration-300
                        ${isSelected
                            ? "text-lg font-bold"
                            : "text-base opacity-70"
                          }
                      `}
                      >
                        {dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className="btn btn-circle btn-md"
              onClick={() => setSelectedOffset((prev) => prev + 1)}
            >
              <CircleChevronRight className="w-full h-full" />
            </button>
          </div>
          <div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setSelectedOffset(0)}
            >
              Today
            </button>
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <p className="text-xl font-bold">Progress</p>
          <div className="w-full flex flex-col gap-4 my-5 bg-base-300 p-5 rounded-2xl">
            <p className="text-2xl font-bold">Daily Task</p>
            <p>
              {TodayFinishedCount}/{TodaytotalCount} Task Completed
            </p>

            <p className="text-xs italic">
              {totalCount === 0
                ? "No tasks yet. Add one to get started!"
                : progress < 30
                  ? "Let's start! You can do it"
                  : progress < 70
                    ? "Good progress, keep going"
                    : progress < 100
                      ? "Almost there, great job!"
                      : "All tasks completed, you're amazing!"}
            </p>

            <div className="w-full h-5 bg-base-100 rounded-2xl border border-primary">
              <div
                className="h-full bg-primary rounded-2xl transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <p className="text-xl font-bold">Today's task</p>
          <div className="w-full flex flex-col gap-4 my-5 bg-base-300 p-5 rounded-2xl">
            <div className="space-y-2 flex-1 h-fit">
              <div className="flex flex-wrap gap-4">
                <select
                  className="select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as Status | "All")
                  }
                >
                  <option value="All">All ({TodaytotalCount})</option>
                  <option value="Not started">
                    Not started ({NotStartedCount})
                  </option>
                  <option value="To do">To do ({TodoCount})</option>
                  <option value="In progress">
                    In progress ({InprogressCount})
                  </option>
                  <option value="Done">Done ({FinishedCount})</option>
                </select>

                <select
                  className="select"
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as Priority | "All")
                  }
                >
                  <option value="All">All ({totalCount})</option>
                  <option value="Urgent">Urgent ({urgentCount})</option>
                  <option value="Average">Average ({averageCount})</option>
                  <option value="Down">Down ({downCount})</option>
                </select>
                <div className="flex flex-wrap gap-2 my-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "StartTime") setSortAsc(!sortAsc);
                      else {
                        setSortBy("StartTime");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Start Time {sortBy === "StartTime" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "EndTime") setSortAsc(!sortAsc);
                      else {
                        setSortBy("EndTime");
                        setSortAsc(true);
                      }
                    }}
                  >
                    End Time {sortBy === "EndTime" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "priority") setSortAsc(!sortAsc);
                      else {
                        setSortBy("priority");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Priority {sortBy === "priority" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>

                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "title") setSortAsc(!sortAsc);
                      else {
                        setSortBy("title");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Title {sortBy === "title" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>

                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "status") setSortAsc(!sortAsc);
                      else {
                        setSortBy("status");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Status {sortBy === "status" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>
                </div>


              </div>
              {filteredTodos.length > 0 ? (
                <ul className="divide-y divide-primary/20">
                  {filteredTodos.map((todo) => (
                    <li key={todo.id}>
                      <TodoItem
                        todo={todo}
                        onDelete={() => deleteTodo(todo.id)}
                        onUpdateStatus={(newStatus) =>
                          updateTodoStatus(todo.id, newStatus)
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex justify-center item">
                  <ListX className="w-40 h-40 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <p className="text-xl font-bold">Tomorrow's task</p>
          <div className="w-full flex flex-col gap-4 my-5 bg-base-300 p-5 rounded-2xl">
            <div className="space-y-2 flex-1 h-fit">
              <div className="flex flex-wrap gap-4">
                <select
                  className="select"
                  value={tomorrowFilter}
                  onChange={(e) =>
                    setTomorrowFilter(e.target.value as Priority | "All")
                  }
                >
                  <option value="All">All ({TomorowtotalCount})</option>
                  <option value="Urgent">Urgent ({TomorowUrgentCount})</option>
                  <option value="Average">
                    Average ({TomorowAverageCount})
                  </option>
                  <option value="Down">Down ({TomorowDownCount})</option>
                </select>

                <select
                  className="select"
                  value={tomorrowStatusFilter}
                  onChange={(e) =>
                    setTomorrowStatusFilter(e.target.value as Status | "All")
                  }
                >
                  <option value="All">All ({TomorowtotalCount})</option>
                  <option value="Not started">
                    Not started ({TomorowNotStartedCount})
                  </option>
                  <option value="To do">To do ({TomorowTodoCount})</option>
                  <option value="In progress">
                    In progress ({TomorowInprogressCount})
                  </option>
                  <option value="Done">Done ({TomorowFinishedCount})</option>
                </select>
                <div className="flex flex-wrap gap-2 my-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "StartTime") setSortAsc(!sortAsc);
                      else {
                        setSortBy("StartTime");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Start Time {sortBy === "StartTime" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "EndTime") setSortAsc(!sortAsc);
                      else {
                        setSortBy("EndTime");
                        setSortAsc(true);
                      }
                    }}
                  >
                    End Time {sortBy === "EndTime" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "priority") setSortAsc(!sortAsc);
                      else {
                        setSortBy("priority");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Priority {sortBy === "priority" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>

                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "title") setSortAsc(!sortAsc);
                      else {
                        setSortBy("title");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Title {sortBy === "title" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>

                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      if (sortBy === "status") setSortAsc(!sortAsc);
                      else {
                        setSortBy("status");
                        setSortAsc(true);
                      }
                    }}
                  >
                    Status {sortBy === "status" ? (sortAsc ? <ChevronUp/> : <ChevronDown/>) : ""}
                  </button>
                </div>


              </div>
              {tomorrowTodos.length > 0 ? (
                <ul className="divide-y divide-primary/20">
                  {tomorrowTodos.map((todo) => (
                    <li key={todo.id}>
                      <TodoItem
                        todo={todo}
                        onDelete={() => deleteTodo(todo.id)}
                        onUpdateStatus={(newStatus) =>
                          updateTodoStatus(todo.id, newStatus)
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex justify-center item">
                  <ListX className="w-40 h-40 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <button
            className="text-3xl w-1/10 h-1/10 fixed bottom-6 right-6"
            onClick={() => setShowForm(true)}
          >
            <CirclePlus className="w-full h-full" />
          </button>
          {showForm && (
            <div
              className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50"
              onClick={() => setShowForm(false)}
            >
              <div
                className="bg-base-200 w-11/12 max-w-lg p-8 rounded-xl shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Add a Task</h2>

                <div className="gap-8 flex flex-col">
                  <div>
                    Title
                    <input
                      type="text"
                      className="input w-full"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>

                  <div>
                    Description
                    <input
                      type="text"
                      className="input w-full"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    Day
                    <input
                      type="date"
                      className="input w-full"
                      value={dayTime}
                      onChange={(e) => setDayTime(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-1/2 flex flex-col">
                      Start time
                      <input
                        type="time"
                        className="input w-full"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="w-1/2 flex flex-col">
                      End time
                      <input
                        type="time"
                        className="input w-full"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    Priority
                    <select
                      className="select w-full"
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value as Priority)
                      }
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="Average">Average</option>
                      <option value="Down">Down</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      addTodo();
                    }}
                  >
                    Add
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllTodos;