// Import necessary components and hooks
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

const Register = () => {

  const [data, setData] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
  });

  const { register } = useAuth();

  const handleDataChange =
    (name) => (e) => {
      setData({
        ...data,
        [name]: e.target.value,
      });
    };

  const handleRegister = async () => await register(data);

  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen">
      <h1 className="text-3xl font-bold">Goss</h1>
      <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          <LockClosedIcon className="h-8 w-8 mb-2" /> Register
        </h1>
        <Input
          placeholder="Email"
          type="email"
          value={data.email}
          onChange={handleDataChange("email")}
        />
        <Input
          placeholder="Username"
          value={data.username}
          onChange={handleDataChange("username")}
        />
        <Input
          placeholder="Name"
          value={data.name}
          onChange={handleDataChange("name")}
        />
        <Input
          placeholder="Password"
          type="password"
          value={data.password}
          onChange={handleDataChange("password")}
        />
        <Button
          fullWidth
          disabled={Object.values(data).some((val) => !val)}
          onClick={handleRegister}
        >
          Register
        </Button>
        <small className="text-zinc-300">
          Already have an account?{" "}
          <a className="text-primary hover:underline" href="/login">
            Login
          </a>
        </small>
      </div>
    </div>
  );
};

export default Register;
