import { File, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { students } from '@/lib/data'
import { studentColumns } from './columns'
import { DataTable } from './data-table'

export default function StudentsPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="excelling">Excelling</TabsTrigger>
          <TabsTrigger value="on-track">On Track</TabsTrigger>
          <TabsTrigger value="at-risk" className="text-destructive">At Risk</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Student
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              Manage your students and view their performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={studentColumns} data={students} />
          </CardContent>
        </Card>
      </TabsContent>
        <TabsContent value="excelling">
          <Card>
            <CardHeader>
              <CardTitle>Excelling Students</CardTitle>
              <CardDescription>
                Students who are performing above expectations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={studentColumns} data={students.filter(s => s.status === 'Excelling')} />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="at-risk">
          <Card>
            <CardHeader>
              <CardTitle>Students At Risk</CardTitle>
              <CardDescription>
                Students who require immediate attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={studentColumns} data={students.filter(s => s.status === 'At Risk' || s.status === 'Needs Improvement')} />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="on-track">
          <Card>
            <CardHeader>
              <CardTitle>On Track Students</CardTitle>
              <CardDescription>
                Students meeting academic expectations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={studentColumns} data={students.filter(s => s.status === 'On Track')} />
            </CardContent>
          </Card>
        </TabsContent>
    </Tabs>
  )
}
