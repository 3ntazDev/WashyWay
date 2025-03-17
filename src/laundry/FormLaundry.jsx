import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { supabase } from "../supabaseClient";

function FormLaundry() {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      location: "",
      description: "",
      phone: "",
      available_slots: "",
      img: null,
      services: [{ serviceName: "", price: "", duration: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("laundry-images")
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = supabase.auth.user();
      let img_url = "";

      if (data.img && data.img.length > 0) {
        img_url = await uploadImage(data.img[0]);
      }

      const { error } = await supabase.from("laundries").insert([
        {
          name: data.name,
          location: data.location,
          description: data.description,
          phone: data.phone,
          available_slots: data.available_slots.split(","),
          img_url,
          owner_id: user.id,
          services: data.services,
        },
      ]);

      if (error) throw error;
      alert("تمت إضافة المغسلة بنجاح!");
      reset();
    } catch (error) {
      alert("حدث خطأ أثناء الإرسال: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          إدخال بيانات المغسلة
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name", { required: true })}
            placeholder="اسم المغسلة"
            className="input"
          />
          <input
            {...register("location", { required: true })}
            placeholder="الموقع"
            className="input"
          />
          <textarea
            {...register("description")}
            placeholder="وصف المغسلة"
            className="input"
          />
          <input
            {...register("phone", { required: true })}
            placeholder="رقم الهاتف"
            type="tel"
            className="input"
          />
          <input
            {...register("available_slots")}
            placeholder="الأوقات المتاحة (مفصولة بفواصل)"
            className="input"
          />
          <input {...register("img")} type="file" className="input" />

          <h3 className="text-lg font-semibold mt-4">الخدمات:</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="service-input">
              <input
                {...register(`services.${index}.serviceName`, { required: true })}
                placeholder="اسم الخدمة"
                className="input"
              />
              <input
                {...register(`services.${index}.price`, { required: true })}
                placeholder="السعر"
                type="number"
                className="input"
              />
              <input
                {...register(`services.${index}.duration`, { required: true })}
                placeholder="المدة بالدقائق"
                type="number"
                className="input"
              />
              <button type="button" onClick={() => remove(index)} className="btn-delete">
                حذف
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ serviceName: "", price: "", duration: "" })} className="btn-add">
            إضافة خدمة
          </button>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إضافة المغسلة"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormLaundry;
