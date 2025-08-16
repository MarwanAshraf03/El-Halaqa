import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useToast } from "../../hooks/use-toast";
import { apiService } from "../../services/api";
import { Student } from "../../types/auth";
import {
  Users,
  UserPlus,
  Calendar,
  BookOpen,
  BarChart3,
  Plus,
  UserCheck,
} from "lucide-react";
import AttendanceManager from "../attendance/AttendanceManager";
import StudentProfile from "../students/StudentProfile";

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name_eng: "",
    name_arb: "",
    bDate: "",
    school: "",
    overAllMem: 0,
    newMem: 0,
  });
  const { toast } = useToast();
  const [studentProfile, setStudentProfile] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const studentsListText = await apiService.getStudentsList();
      // Parse the student list format: "id - name_arabic - name_english"
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

  const handleAddStudent = async () => {
    try {
      await apiService.createStudent({
        ...newStudent,
        logs: {},
      });

      toast({
        title: "تم إضافة الطالب بنجاح",
        description: `تم إضافة ${newStudent.name_arb} إلى النظام`,
      });

      setNewStudent({
        name_eng: "",
        name_arb: "",
        bDate: "",
        school: "",
        overAllMem: 0,
        newMem: 0,
      });
      setIsAddingStudent(false);
      loadStudents();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة الطالب",
        description: "تعذر إضافة الطالب، يرجى المحاولة لاحقاً",
      });
    }
  };

  const stats = [
    {
      title: "إجمالي الطلاب",
      value: students.length,
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "الحضور اليوم",
      value: "0", // TODO: Implement attendance tracking
      icon: Calendar,
      color: "bg-accent",
    },
    {
      title: "الحفظ الجديد",
      value: students.reduce((sum, s) => sum + s.newMem, 0),
      icon: BookOpen,
      color: "bg-secondary",
    },
    {
      title: "إجمالي الحفظ",
      value: students.reduce((sum, s) => sum + s.overAllMem, 0),
      icon: BarChart3,
      color: "bg-muted",
    },
  ];

  // if (studentProfile) {
  //   return (
  //     <StudentProfile
  //       studentId={students[0]?.id || ""}
  //       // onClose={() => setStudentProfile(false)}
  //     />
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-arabic">
                    {stat.title}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students" className="gap-3">
            <Users className="h-4 w-4" />
            إدارة الطلاب
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-3">
            <UserCheck className="h-4 w-4" />
            تسجيل الحضور
          </TabsTrigger>
          <TabsTrigger value="studentProfile" className="gap-3">
            <UserCheck className="h-4 w-4" />
            دفتر الطالب
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-arabic text-primary">
                  إدارة الطلاب
                </CardTitle>
                <Dialog
                  open={isAddingStudent}
                  onOpenChange={setIsAddingStudent}
                >
                  <DialogTrigger asChild>
                    <Button variant="islamic" className="gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة طالب جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-arabic text-primary">
                        إضافة طالب جديد
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name_arb">الاسم بالعربية</Label>
                        <Input
                          id="name_arb"
                          value={newStudent.name_arb}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              name_arb: e.target.value,
                            })
                          }
                          placeholder="أدخل الاسم بالعربية"
                          className="font-arabic"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name_eng">الاسم بالإنجليزية</Label>
                        <Input
                          id="name_eng"
                          value={newStudent.name_eng}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              name_eng: e.target.value,
                            })
                          }
                          placeholder="Enter name in English"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bDate">تاريخ الميلاد</Label>
                        <Input
                          id="bDate"
                          type="date"
                          value={newStudent.bDate}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              bDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school">المدرسة</Label>
                        <Input
                          id="school"
                          value={newStudent.school}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              school: e.target.value,
                            })
                          }
                          placeholder="اسم المدرسة"
                          className="font-arabic"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="overAllMem">إجمالي الحفظ</Label>
                          <Input
                            id="overAllMem"
                            type="number"
                            value={newStudent.overAllMem}
                            onChange={(e) =>
                              setNewStudent({
                                ...newStudent,
                                overAllMem: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newMem">الحفظ الجديد</Label>
                          <Input
                            id="newMem"
                            type="number"
                            value={newStudent.newMem}
                            onChange={(e) =>
                              setNewStudent({
                                ...newStudent,
                                newMem: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleAddStudent}
                        variant="islamic"
                        className="w-full"
                      >
                        إضافة الطالب
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-arabic">
                      لا يوجد طلاب مسجلين حالياً
                    </p>
                  </div>
                ) : (
                  // Display students in a grid
                  // set onclick to show the student card using StudentProfile
                  <div className="grid gap-4">
                    {students.map((student) => (
                      <Card key={student.id} className="border-primary/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <UserPlus className="h-5 w-5 text-primary" />
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
                            {/* {studentProfile && (
                              <StudentProfile studentId={student.id} />
                            )} */}
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                إجمالي: {student.overAllMem}
                              </Badge>
                              <Badge variant="outline">
                                جديد: {student.newMem}
                              </Badge>
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

        <TabsContent value="attendance">
          <AttendanceManager onAttendanceTaken={loadStudents} />
        </TabsContent>
        <TabsContent value="studentProfile">
          {/* <AttendanceManager onAttendanceTaken={loadStudents} /> */}
          {studentProfile && <StudentProfile studentId={studentProfile} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
