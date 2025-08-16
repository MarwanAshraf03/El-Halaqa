import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { apiService } from "../../services/api";
import { useToast } from "../../hooks/use-toast";
import { Users, UserCheck, Calendar, CheckCircle2 } from "lucide-react";

interface Student {
  id: string;
  name_arb: string;
  name_eng: string;
}

interface AttendanceManagerProps {
  onAttendanceTaken?: () => void;
}

const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  onAttendanceTaken,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsListText = await apiService.getStudentsList();
      const studentLines = studentsListText.trim().split("\n");
      const studentsData: Student[] = [];

      for (const line of studentLines) {
        if (line.trim()) {
          const parts = line.split(" - ");
          if (parts.length >= 3) {
            const [id, name_arb, name_eng] = parts;
            studentsData.push({
              id: id.trim(),
              name_arb: name_arb.trim(),
              name_eng: name_eng.trim(),
            });
          }
        }
      }

      setStudents(studentsData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تحميل البيانات",
        description: "تعذر تحميل قائمة الطلاب",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (studentName: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentName)) {
      newSelected.delete(studentName);
    } else {
      newSelected.add(studentName);
    }
    setSelectedStudents(newSelected);
  };

  const selectAll = () => {
    const allNames = students.map((s) => s.name_arb);
    setSelectedStudents(new Set(allNames));
  };

  const clearAll = () => {
    setSelectedStudents(new Set());
  };

  const handleTakeAttendance = async () => {
    if (selectedStudents.size === 0) {
      toast({
        variant: "destructive",
        title: "لا يوجد طلاب محددين",
        description: "يرجى تحديد الطلاب الحاضرين أولاً",
      });
      return;
    }

    try {
      setSubmitting(true);
      const attendanceList = Array.from(selectedStudents);
      await apiService.takeAttendance(attendanceList);

      toast({
        title: "تم تسجيل الحضور بنجاح",
        description: `تم تسجيل حضور ${selectedStudents.size} طالب`,
      });

      setSelectedStudents(new Set());
      onAttendanceTaken?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الحضور",
        description: "تعذر تسجيل الحضور، يرجى المحاولة لاحقاً",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                جارٍ تحميل قائمة الطلاب...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-full shadow-glow">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="font-arabic text-primary">
                تسجيل الحضور
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("ar-SA", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            {selectedStudents.size} / {students.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              disabled={students.length === 0}
            >
              تحديد الكل
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              disabled={selectedStudents.size === 0}
            >
              إلغاء التحديد
            </Button>
            <Button
              variant="islamic"
              size="sm"
              onClick={handleTakeAttendance}
              disabled={selectedStudents.size === 0 || submitting}
              className="gap-2 mr-auto"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  جارٍ التسجيل...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  تسجيل الحضور ({selectedStudents.size})
                </>
              )}
            </Button>
          </div>

          {/* Students List */}
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-arabic">
                لا يوجد طلاب مسجلين
              </p>
            </div>
          ) : (
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                    // selectedStudents.has(student.name_arb)
                    selectedStudents.has(student.id)
                      ? "bg-primary/5 border-primary/30"
                      : "border-border"
                  }`}
                  // onClick={() => toggleStudentSelection(student.name_arb)}
                  onClick={() => toggleStudentSelection(student.id)}
                >
                  <Checkbox
                    // checked={selectedStudents.has(student.name_arb)}
                    checked={selectedStudents.has(student.id)}
                    // onChange={() => toggleStudentSelection(student.name_arb)}
                    onChange={() => toggleStudentSelection(student.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium font-arabic text-sm">
                      {student.name_arb}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.name_eng}
                    </p>
                  </div>
                  {selectedStudents.has(student.name_arb) && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceManager;
