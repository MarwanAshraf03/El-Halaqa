import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "../../hooks/use-toast";
import { apiService } from "../../services/api";
import { Student, StudentLog } from "../../types/auth";
import {
  BookOpen,
  Users,
  Calendar,
  Star,
  Plus,
  Edit,
  UserCheck,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import StudentProfile from "../students/StudentProfile";

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [studentProfile, setStudentProfile] = useState("");

  // const [newLog, setNewLog] = useState(null);
  // newLog can have memDone or revDone or both
  const [newLog, setNewLog] = useState<{
    memDone?: string;
    memGrade?: string;
    revDone?: string;
    revGrade?: string;
    notes?: string;
  }>({
    // memDone: "false",
    // memGrade: "0/10",
    // revDone: "false",
    // revGrade: "0/10",
    notes: "",
  });

  // const [newLog, setNewLog] = useState({
  //   memDone?: "false",
  //   memGrade?: "0/10",
  //   revDone?: "false",
  //   revGrade?: "0/10",
  //   notes: "",
  // });
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const studentsListText = await apiService.getStudentsList();
      const studentLines = studentsListText.trim().split("\n");
      const studentsData: Student[] = [];

      for (const line of studentLines) {
        if (line.trim()) {
          const [id] = line.split(" - ");
          if (id) {
            try {
              const student = await apiService.getStudent(id);
              studentsData.push({ ...student, id });
            } catch (error) {
              console.error(`Failed to load student ${id}:`, error);
            }
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
    }
  };

  const handleAddLog = async () => {
    if (!selectedStudent || !user) return;

    try {
      const log: StudentLog = {
        teacherId: user.id,
        teacherUserName: user.userName,
        memDone: newLog.memDone,
        memGrade: newLog.memGrade,
        revDone: newLog.revDone,
        revGrade: newLog.revGrade,
        time: new Date().toISOString(),
        notes: newLog.notes,
      };

      await apiService.addLogToStudent(selectedStudent.id, log);

      toast({
        title: "تم إضافة السجل بنجاح",
        description: `تم إضافة سجل جديد للطالب ${selectedStudent.name_arb}`,
      });

      setNewLog({
        notes: "",
      });
      setIsAddingLog(false);
      setSelectedStudent(null);
      loadStudents();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة السجل",
        description: "تعذر إضافة السجل، يرجى المحاولة لاحقاً",
      });
    }
  };

  const getRoleCapabilities = () => {
    if (user?.type === "Mem") {
      return {
        title: "معلم التحفيظ",
        description: "إدارة الحفظ الجديد وتقييم الطلاب",
        canGradeMem: true,
        canGradeRev: false,
      };
    } else if (user?.type === "Rev") {
      return {
        title: "معلم المراجعة",
        description: "إدارة المراجعة وتقييم الطلاب",
        canGradeMem: false,
        canGradeRev: true,
      };
    }
    return {
      title: "معلم",
      description: "إدارة الطلاب",
      canGradeMem: false,
      canGradeRev: false,
    };
  };

  const capabilities = getRoleCapabilities();

  return (
    <div className="space-y-6">
      {/* Teacher Info Card */}
      <Card className="shadow-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 gradient-primary rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary font-arabic">
                {capabilities.title}
              </h2>
              <p className="text-muted-foreground">
                {capabilities.description}
              </p>
              <Badge variant="secondary" className="mt-2">
                {user?.userName}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students" className="gap-2">
            <Users className="h-4 w-4" />
            الطلاب
          </TabsTrigger>
          <TabsTrigger value="studentProfile" className="gap-2">
            دفتر الطالب
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          {/* Students List */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-arabic text-primary">
                قائمة الطلاب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-arabic">
                      لا يوجد طلاب متاحين
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {students.map((student) => (
                      <Card key={student.id} className="border-primary/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium font-arabic">
                                  {student.name_arb}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {student.name_eng}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {student.school}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                className="text-primary"
                                onClick={() => {
                                  console.log(
                                    `Viewing profile for ${student.id}`
                                  );
                                  // setStudentProfile((id) => !prev); // toggle
                                  setStudentProfile(student.id);
                                  // return (
                                  //   <StudentProfile studentId={student.id} />
                                  // );
                                }}
                              >
                                عرض التفاصيل
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                إجمالي: {student.overAllMem}
                              </Badge>
                              <Badge variant="outline">
                                جديد: {student.newMem}
                              </Badge>
                              <Dialog
                                open={
                                  isAddingLog &&
                                  selectedStudent?.id === student.id
                                }
                                onOpenChange={(open) => {
                                  setIsAddingLog(open);
                                  if (open) {
                                    setSelectedStudent(student);
                                  } else {
                                    setSelectedStudent(null);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Plus className="h-4 w-4" />
                                    إضافة سجل
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="font-arabic text-primary">
                                      إضافة سجل للطالب {student.name_arb}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {capabilities.canGradeMem && (
                                      <>
                                        {/* <div className="space-y-2">
                                      <Label>حالة الحفظ</Label>
                                      <Select
                                        value={newLog.memDone}
                                        onValueChange={(value) => setNewLog({ ...newLog, memDone: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="true">مكتمل</SelectItem>
                                          <SelectItem value="false">غير مكتمل</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div> */}
                                        <div className="space-y-2">
                                          <Label htmlFor="memDone">
                                            تم التحفيظ
                                          </Label>
                                          <Input
                                            id="memDone"
                                            value={newLog.memDone}
                                            onChange={(e) =>
                                              setNewLog({
                                                ...newLog,
                                                memDone: e.target.value,
                                              })
                                            }
                                            // placeholder="مثال: 10/10"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="memGrade">
                                            درجة الحفظ
                                          </Label>
                                          <Input
                                            id="memGrade"
                                            value={newLog.memGrade}
                                            onChange={(e) =>
                                              setNewLog({
                                                ...newLog,
                                                memGrade: e.target.value,
                                              })
                                            }
                                            placeholder="مثال: 10/10"
                                          />
                                        </div>
                                      </>
                                    )}

                                    {capabilities.canGradeRev && (
                                      <>
                                        <div className="space-y-2">
                                          <Label htmlFor="revDone">
                                            تم المراجعة
                                          </Label>
                                          <Input
                                            id="revDone"
                                            value={newLog.revDone}
                                            onChange={(e) =>
                                              setNewLog({
                                                ...newLog,
                                                revDone: e.target.value,
                                              })
                                            }
                                            // placeholder="مثال: 10/10"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="revGrade">
                                            درجة المراجعة
                                          </Label>
                                          <Input
                                            id="revGrade"
                                            value={newLog.revGrade}
                                            onChange={(e) =>
                                              setNewLog({
                                                ...newLog,
                                                revGrade: e.target.value,
                                              })
                                            }
                                            placeholder="مثال: 8/10"
                                          />
                                        </div>
                                      </>
                                    )}

                                    <div className="space-y-2">
                                      <Label htmlFor="notes">ملاحظات</Label>
                                      <Textarea
                                        id="notes"
                                        value={newLog.notes}
                                        onChange={(e) =>
                                          setNewLog({
                                            ...newLog,
                                            notes: e.target.value,
                                          })
                                        }
                                        placeholder="أضف ملاحظاتك هنا..."
                                        className="font-arabic"
                                      />
                                    </div>

                                    <Button
                                      onClick={handleAddLog}
                                      variant="islamic"
                                      className="w-full"
                                    >
                                      إضافة السجل
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="studentProfile">
          {/* Student Profile */}
          {studentProfile && <StudentProfile studentId={studentProfile} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
