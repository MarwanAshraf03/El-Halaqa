import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
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
} from "lucide-react";

interface StudentProfileProps {
  studentId: string;
  onClose?: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  studentId,
  onClose,
}) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [logs, setLogs] = useState<Record<string, StudentLog>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

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
  const recentLogs = logsArray
    // .sort((a, b) => Date(b.time) - a.time)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  const completedMem = logsArray.filter((log) => log.memDone === "true").length;
  const completedRev = logsArray.filter((log) => log.revDone === "true").length;
  const memProgress =
    student.overAllMem > 0 ? (completedMem / student.overAllMem) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card className="shadow-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex flex-col justify-between">
              <Button
                variant="outline"
                className="text-primary"
                onClick={() => {
                  console.log(`Viewing profile for ${student.id}`);
                  handleClose; // return (
                  //   <StudentProfile studentId={student.id} />
                  // );
                }}
              >
                عرض التفاصيل
              </Button>
            </div>
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
                    {new Date(student.bDate).toLocaleDateString("ar-SA")}
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

      {/* Recent Logs */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-arabic text-primary">
            السجلات الحديثة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-arabic">
                لا توجد سجلات متاحة
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <Card key={log.id} className="border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.time).toLocaleDateString("ar-SA")} -{" "}
                            {new Date(log.time).toLocaleTimeString("ar-SA")}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge
                            variant={
                              log.memDone === "true" ? "default" : "secondary"
                            }
                          >
                            حفظ:{" "}
                            {log.memDone === "true" ? "مكتمل" : "غير مكتمل"}
                          </Badge>
                          {log.memGrade && (
                            <Badge variant="outline">
                              درجة الحفظ: {log.memGrade}
                            </Badge>
                          )}
                          <Badge
                            variant={
                              log.revDone === "true" ? "default" : "secondary"
                            }
                          >
                            مراجعة:{" "}
                            {log.revDone === "true" ? "مكتمل" : "غير مكتمل"}
                          </Badge>
                          {log.revGrade && log.revGrade !== "none" && (
                            <Badge variant="outline">
                              درجة المراجعة: {log.revGrade}
                            </Badge>
                          )}
                        </div>

                        {log.notes && (
                          <p className="text-sm text-muted-foreground font-arabic mt-2">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
