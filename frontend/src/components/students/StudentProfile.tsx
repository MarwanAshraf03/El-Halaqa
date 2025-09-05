import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { apiService } from "../../services/api";
import { Student, StudentLog } from "../../types/auth";
import { useToast } from "../../hooks/use-toast";
import {
  User,
  Calendar,
  School,
  BookOpen,
  Star,
  Clock,
  FileText,
  Filter,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";

interface StudentProfileProps {
  studentId: string;
  userRole: string;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  studentId,
  userRole,
}) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [logs, setLogs] = useState<Record<string, StudentLog>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const studentData = await apiService.getStudent(studentId);
      setStudent(studentData);
      setLogs(studentData.logs || {});
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تحميل البيانات",
        description: "تعذر تحميل بيانات الطالب",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLogsByDate = async (date: string) => {
    if (!studentId) return;

    try {
      setIsLoadingLogs(true);
      const filteredLogs = await apiService.getLogs(studentId, date);
      setLogs(filteredLogs);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تحميل السجلات",
        description: "تعذر تحميل سجلات التاريخ المحدد",
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date) {
      loadLogsByDate(date);
    } else {
      // Load all logs (from student data)
      if (student) {
        setLogs(student.logs || {});
      }
    }
  };

  const deleteLog = async (studentId: string, logId: string) => {
    if (!studentId || !logId) return;

    try {
      console.log("before deletion");
      await apiService.deleteLog(studentId, logId);
      console.log("after deletion");
      toast({
        variant: "default",
        title: "تم الحذف بنجاح",
        description: "تم حذف السجل بنجاح",
      });
      // Remove the deleted log from the state
      setLogs((prevLogs) => {
        const updatedLogs = { ...prevLogs };
        delete updatedLogs[logId];
        return updatedLogs;
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: "تعذر حذف السجل",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center p-8">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">لم يتم العثور على بيانات الطالب</p>
      </div>
    );
  }

  const logsArray = Object.entries(logs).map(([id, log]) => ({ id, ...log }));
  // const sortedLogs = logsArray.sort((a, b) => b.time - a.time);
  const sortedLogs = logsArray.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  const displayedLogs = showAllLogs ? sortedLogs : sortedLogs.slice(0, 5);

  const completedMem = logsArray.filter((log) => log.memDone === "true").length;
  const completedRev = logsArray.filter((log) => log.revDone === "true").length;
  const memProgress = 100;

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card className="shadow-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="p-4 gradient-primary rounded-full shadow-glow">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary font-arabic mb-2">
                {student.name_arb}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {student.name_eng}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    تاريخ الميلاد:{" "}
                    {/* {new Date(student.bDate).toLocaleDateString("ar-SA")} */}
                    {new Date(student.bDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" />
                  <span className="text-sm font-arabic">{student.school}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    عدد السجلات: {logsArray.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-primary">
                  {student.overAllMem}
                </p>
                <p className="text-sm text-muted-foreground font-arabic">
                  إجمالي الحفظ
                </p>
                <Progress value={memProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-full">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-accent">
                  {student.newMem}
                </p>
                <p className="text-sm text-muted-foreground font-arabic">
                  الحفظ الجديد
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-primary">
                  {completedRev}
                </p>
                <p className="text-sm text-muted-foreground font-arabic">
                  المراجعة المكتملة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Section */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="font-arabic text-primary">
              سجلات الطالب
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="date-filter" className="text-sm">
                  تصفية بالتاريخ:
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-auto"
                />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateChange("")}
                    className="text-xs"
                  >
                    إلغاء التصفية
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="mr-2 text-muted-foreground">
                جارٍ تحميل السجلات...
              </span>
            </div>
          ) : displayedLogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-arabic">
                {selectedDate
                  ? "لا توجد سجلات لهذا التاريخ"
                  : "لا توجد سجلات متاحة"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedLogs.map((log) => (
                <Card key={log.id} className="border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.time).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                            -{" "}
                            {new Date(log.time).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {log.memDone && (
                            <Badge variant={"secondary"}>
                              حفظ: {log.memDone}
                            </Badge>
                          )}
                          {log.memGrade && (
                            <Badge variant="outline">
                              درجة الحفظ: {log.memGrade}
                            </Badge>
                          )}
                          {log.revDone && (
                            <Badge variant={"secondary"}>
                              مراجعة: {log.revDone}
                            </Badge>
                          )}
                          {log.revGrade && (
                            <Badge variant="outline">
                              درجة المراجعة: {log.revGrade}
                            </Badge>
                          )}
                          <Badge variant="secondary">
                            معلم: {log.teacherUserName}
                          </Badge>
                        </div>

                        {log.notes && (
                          <p className="text-sm text-muted-foreground font-arabic mt-2">
                            {log.notes !== "null"
                              ? `ملاحظات: ${log.notes}`
                              : "لا توجد ملاحظات"}
                          </p>
                        )}
                      </div>
                      {userRole === "Admin" && (
                        <div className="flex-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-100"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "هل أنت متأكد أنك تريد حذف هذا السجل؟"
                                  )
                                ) {
                                  // Call a function to delete the log
                                  deleteLog(student.id, log.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!selectedDate && sortedLogs.length > 5 && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllLogs(!showAllLogs)}
                    className="gap-2"
                  >
                    {showAllLogs ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        إخفاء السجلات
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        عرض جميع السجلات ({sortedLogs.length})
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
