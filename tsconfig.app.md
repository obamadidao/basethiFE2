/////////////////////////////////////////////////////////////App.tsx
function App() {
  let element = useRoutes([
    {
      path: "/List",
      element: <List />,
    },
    {
      path: "/add",
      element: <Add />,
    },
    {
      path: "/update/:id",
      element: <Update />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

/////////////////////////////////////////////////////////////List.tsx
export default function List() {
     const navigate = useNavigate();

    const columns = [
    {
        title: "name",
        dataIndex: "name",
    },
    {
        title: "price",
        dataIndex: "price",
    },
    {
        title: "imageUrl",
        dataIndex: "imageUrl",
    },
    {
        title: "category",
        dataIndex: "category",
    },
    {
        title: "inStock",
        dataIndex: "inStock",
        render: (inStock:boolean) => <Tag>{inStock ?'con hang':'het hang' }</Tag>  
    },
    {
        title: "Actions",
        render: (record: any) => 
    <>
        <Button onClick={()=>onDelete(record.id)}>Delete</Button>
        <Button onClick={()=>navigate(`/update/${record.id}`)}>Update</Button>
    </>
    },
];
    const qc = useQueryClient();
    const onDelete = async (id:any) =>{
        if(window.confirm("Xoa")) {
            await axios.delete("http://localhost:3000/products/" + id);
            qc.invalidateQueries({queryKey: ['products']});
        }
    };
    const {data} = useQuery({
        queryKey: ['products'],
        queryFn: async()=>{
            const res = await axios.get("http://localhost:3000/products")
            return res.data;
    },
});

return (
<div>
    <h1>List</h1>
    <Table columns={columns} dataSource={data} />
</div>
);
}

/////////////////////////////////////////////////////////////Add.tsx
interface Category {
  id: number;
  name: string;
}


export default function Add() {

  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/categories")
      .then(res => setCategories(res.data))
  }, []);


  const onFinish = (values: any) => {

    axios.post("http://localhost:3000/products", values)
      .then(() => {
        alert(" Thêm sản phẩm thành công!");
        navigate("/List");
      })
  };

  return (
    <div>
      <h1>Thêm Sản Phẩm</h1>
      <Form onFinish={onFinish}>


        <Form.Item label="name"
         name="name"
          rules={[{ required: true }]}>
          <Input />
        </Form.Item>


        <Form.Item label="price"
         name="price"
          rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>


        <Form.Item label="imageUrl"
         name="imageUrl"
          rules={[{ required: true }]}>
          <Input />
        </Form.Item>


        <Form.Item label="category"
         name="category"
          rules={[{ required: true }]}>
          <Select
            options={categories.map((c) => ({
              label: c.name,
              value: c.name, 
            }))}
          />
        </Form.Item>


        {/* <Form.Item label="inStock"
         name="inStock"
          rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Còn hàng", value: true },
              { label: "Hết hàng", value: false },
            ]}
          />
        </Form.Item> */}

        <Form.Item
            label="Còn hàng"
            name="inStock"
            valuePropName="checked"
            >
            <Checkbox />
        </Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm sản phẩm
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
}

/////////////////////////////////////////////////////////////Update.tsx
interface Category {
  id: number;
  name: string;
}

export default function Update() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams(); // ✅ THÊM: lấy id sản phẩm từ URL
  const [form] = Form.useForm(); // ✅ THÊM: tạo form để điều khiển giá trị

  useEffect(() => {

    axios.get("http://localhost:3000/categories")
      .then(res => setCategories(res.data));

    // ✅ THÊM: lấy thông tin sản phẩm theo id để đổ vào form
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => form.setFieldsValue(res.data));
  }, [id]);

  const onFinish = (values: any) => {
   
    axios.put(`http://localhost:3000/products/${id}`, values) // ✅ SỬA: post → put
      .then(() => {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/List");
      });
  };

  return (
    <div>
      <h1>Cập Nhật Sản Phẩm</h1>
      {/* ✅ SỬA: thêm form={form} */}
      <Form form={form} onFinish={onFinish}>
        <Form.Item 
        label="name" 
        name="name" 
        rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item 
        label="price" 
        name="price" 
        rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>

        <Form.Item 
         label="imageUrl"
         name="imageUrl" 
         rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item 
          label="category"
          name="category"
          rules={[{ required: true }]}>
          <Select
            options={categories.map((c) => ({
              label: c.name,
              value: c.name,
            }))}
          />
        </Form.Item>


        <Form.Item
          label="Còn hàng"
          name="inStock"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

/////////////////////////////////////////////////////////////Register.tsx
export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
      await axios.post("http://localhost:3000/users", {
            email: values.email,
            password: values.password,
        }
      );
      alert("Đăng ký thành công");
      navigate("/Login");
  };

  return (
    <div>
      <h1>Đăng ký</h1>
      <Form onFinish={onFinish}>

        <Form.Item label="email"
         name="email"
          rules={[{ required: true },
            {type: "email", message: "Email không hợp lệ"}
          ]}>
          <Input />
        </Form.Item>

        <Form.Item label="password"
         name="password"
          rules={[{ required: true },
            {min:6, message: "Không dưới 6 ký tự"}
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
label="Xác nhận mật khẩu"
name="confirm"
dependencies={['password']}
rules={[
{ required: true, message: "Xác nhận" },
({ getFieldValue }) => ({
validator(_, value) {
if (!value || getFieldValue("password") === value) {
return Promise.resolve();
}
return Promise.reject(new Error("Không khớp"));
},
}),
]}
>
<Input.Password />
</Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
}

/////////////////////////////////////////////////////////////Login.tsx
export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email: values.email,
        password: values.password,
      });
      alert("Đăng nhập thành công");
      localStorage.setItem("token", res.data.accessToken); 
      navigate("/List");
    } catch (error) {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div>
      <h1>Đăng nhập</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true },
            { min: 6, message: "Không dưới 6 ký tự" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}