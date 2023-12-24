import { Button, Form, Input } from 'antd'
import './Home.scss'

export interface ITask {
  id: number
  title: string
  description?: string | null
  estimated_time?: number | null
  parent_task_id?: number | null
  parent_task?: ITask | null
}

export function Home() {
  const [form] = Form.useForm()

  return (
    <div className="home">
      <div className="home_container">
        <h1>My Tasks</h1>
        <div>
          <Form
            form={form}
            onFinish={async values => {
              console.log(values)
              form.resetFields()
            }}
          >
            <div className="add-form">
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Form.Item name="title">
                <Input placeholder="Task title" />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
