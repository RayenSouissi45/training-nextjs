"use client";
import { useForm } from "react-hook-form";

export default function Page() {
  const {
    register,
    handleSubmit,
    watch, // Watch fields in real-time
    formState: { errors },
  } = useForm();

  const subscribe = watch("subscribe"); // Watch the subscribe checkbox

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Your name"
        className="border p-2"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <label>
        <input {...register("subscribe")} type="checkbox" />
        Subscribe to our newsletter
      </label>

      {/* Show email field only if the checkbox is checked */}
      {subscribe && (
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Your email"
          className="border p-2"
        />
      )}

      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <button type="submit" className="bg-black text-white px-4 py-2">
        Submit
      </button>
    </form>
  );
}
