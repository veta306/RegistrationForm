import { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import mailIcon from "../../assets/mail.png";
import phoneIcon from "../../assets/phone.png";
import skypeLogo from "../../assets/skype.png";
import facebookLogo from "../../assets/facebook.png";
import addIcon from "../../assets/add.png";
import tickIcon from "../../assets/tick.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
  agreement: z.literal(true, {
    errorMap: () => ({
      message: "You must accept Terms and Use",
    }),
  }),
  firstName: z.string().min(1),
  secondName: z.string().min(1),
  birthDate: z.string().min(1),
  birthPlace: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .min(1)
    .max(15)
    .regex(/^\+(\d|\s)*$/, "Phone number must contain only digits"),
  skypeName: z.string().optional(),
  facebookProfile: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.string(),
  optional: z.string().optional(),
});
export default function ProfileForm() {
  const {
    register,
    trigger,
    formState: { errors },
    setValue,
    getValues,
    watch,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [currentStep, setCurrentStep] = useState(0);
  const states = useLoaderData();
  const countries = states.map((state) => state.country);
  const location = useLocation();
  const country = watch("country", getValues("birthPlace"));
  useEffect(() => {
    setValue("email", location.state.email);
    setValue("phoneNumber", location.state.phoneNumber);
  }, [setValue, location]);
  const onSubmit = (data) => console.log(data);
  return (
    <div className="w-[456px]">
      <div className="mt-2 mb-20">
        <ul className="flex">
          <li className="flex">
            <div className={`w-3 h-3 bg-[#007AFF] rounded-xl`}></div>
            <div className="w-10 h-[1px] mx-2 my-[6px] bg-[#B9B9C3]"></div>
          </li>
          <li className="flex">
            <div
              className={`w-3 h-3 rounded-xl border-[#B9B9C3] ${
                currentStep >= 1 ? "bg-[#007AFF]" : "border-[1px]"
              }`}
            ></div>
            <div className="w-10 h-[1px] mx-2 my-[6px] bg-[#B9B9C3]"></div>
          </li>
          <li>
            <div
              className={`w-3 h-3 rounded-xl border-[#B9B9C3] ${
                currentStep >= 2 ? "bg-[#007AFF]" : "border-[1px]"
              }`}
            ></div>
          </li>
        </ul>
      </div>
      <div>
        <div className="mb-4 text-4xl font-bold">Profile info</div>
        <div className="font-light">
          Fill in the data for profile. It will take a couple of minutes.
          <br /> You only need a passport
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 0 && (
          <>
            <div className="flex my-8 h-8 gap-2 items-center">
              <input
                {...register("agreement")}
                className="m-[7px] h-[18px] w-[18px]"
                type="checkbox"
                id="agreement"
              />
              <label htmlFor="agreement">I agree with</label>
              <a
                className="text-blue-700"
                href="https://en.wikipedia.org/wiki/Terms_of_service"
                target="_blank"
              >
                Terms of use
              </a>
            </div>
            {errors.agreement?.message && (
              <p className="text-sm text-red-400">{errors.agreement.message}</p>
            )}
            <div className="flex flex-col gap-8 p-8 border-[#E2E4E5] rounded-lg border-[1px]">
              <div>
                <div className="text-xl font-semibold">Personal data</div>
                <div className="text-xs font-light">
                  Specify exactly as in your passport
                </div>
              </div>
              <div>
                <label className="text-sm" htmlFor="firstName">
                  First name
                </label>
                <input
                  {...register("firstName")}
                  className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                  type="text"
                  id="firstName"
                />
              </div>
              <div>
                <label className="text-sm" htmlFor="secondName">
                  Second name
                </label>
                <input
                  {...register("secondName")}
                  className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                  type="text"
                  id="secondName"
                />
              </div>
              <div className="flex gap-8">
                <div className="w-1/2">
                  <label className="text-sm" htmlFor="birthDate">
                    Date of birth
                  </label>
                  <input
                    {...register("birthDate")}
                    className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                    type="date"
                    id="birthDate"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-sm" htmlFor="birthPlace">
                    Place of birth
                  </label>
                  <select
                    {...register("birthPlace")}
                    className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                    id="birthPlace"
                  >
                    <option></option>
                    {countries.map((country, index) => {
                      return <option key={index}>{country}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col my-8 p-4 border-[#E2E4E5] rounded-lg border-[1px]">
              <div className="text-lg">123-45-678</div>
              <p className="text-sm text-[#575F6E]">✓ Your ITIN</p>
            </div>
            <button
              className="h-12 px-8 border-[#BBBFC1] border-[1px] rounded"
              type="button"
              onClick={async () => {
                const output = await trigger(
                  [
                    "agreement",
                    "firstName",
                    "secondName",
                    "birthDate",
                    "birthPlace",
                  ],
                  {
                    shouldFocus: true,
                  }
                );
                if (!output) return;
                else setCurrentStep(1);
              }}
            >
              Go Next →
            </button>
          </>
        )}
        {currentStep === 1 && (
          <>
            <div className="flex flex-col gap-12 my-8 p-8 border-[#E2E4E5] rounded-lg border-[1px]">
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-lg font-semibold">Contacts</p>
                  <p className="text-xs font-light">
                    These contacts are used to inform about orders
                  </p>
                </div>
                <div className="flex gap-4 items-center border-[#B9B9C3] border-b-[1px]">
                  <img className="h-6 w-6" src={mailIcon} alt="mail" />
                  <input
                    {...register("email")}
                    className="w-full h-11 py-2"
                    type="text"
                  />
                </div>
                {errors.email?.message && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
                <div className="flex gap-4 items-center border-[#B9B9C3] border-b-[1px]">
                  <img className="h-6 w-6" src={phoneIcon} alt="mail" />
                  <input
                    {...register("phoneNumber")}
                    className="w-full h-11 py-2"
                    type="text"
                  />
                </div>
                {errors.phoneNumber?.message && (
                  <p className="text-sm text-red-400">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-lg font-semibold">Social network</p>
                  <p className="text-xs font-light">
                    Indicate the desired communication method
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-[188px] flex gap-4 items-center border-[#B9B9C3] border-b-[1px]">
                    <img className="h-6 w-6" src={skypeLogo} alt="skype" />
                    <span>Skype</span>
                  </div>
                  <input
                    {...register("skypeName")}
                    className="w-[188px] h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                    placeholder="@name"
                    type="text"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-[188px] flex gap-4 items-center border-[#B9B9C3] border-b-[1px]">
                    <img
                      className="h-6 w-6"
                      src={facebookLogo}
                      alt="facebook"
                    />
                    <span>Facebook</span>
                  </div>
                  <input
                    {...register("facebookProfile")}
                    className="w-[188px] h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                    placeholder="@profile"
                    type="text"
                  />
                </div>
                <div className="flex gap-2 text-[#007AFF] items-center">
                  <img src={addIcon} alt="add" />
                  <p className="font-medium">Add More</p>
                </div>
              </div>
            </div>
            <button
              className="h-12 px-8 border-[#BBBFC1] border-[1px] rounded"
              type="button"
              onClick={async () => {
                const output = await trigger(
                  ["email", "phoneNumber", "skypeName", "facebookProfile"],
                  {
                    shouldFocus: true,
                  }
                );
                if (!output) return;
                else setCurrentStep(2);
              }}
            >
              Go Next →
            </button>
          </>
        )}
        {currentStep === 2 && (
          <>
            <div className="flex flex-col gap-8 my-8 p-8 border-[#E2E4E5] rounded-lg border-[1px]">
              <div>
                <p className="text-lg font-semibold">Delivery address</p>
                <p className="text-xs font-light">Used for shipping orders</p>
              </div>
              <div>
                <label className="text-sm" htmlFor="address">
                  Address
                </label>
                <input
                  {...register("address")}
                  className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                  type="text"
                  id="address"
                />
              </div>
              <div>
                <label className="text-sm" htmlFor="city">
                  City
                </label>
                <select
                  {...register("city")}
                  className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                  type="text"
                  id="city"
                >
                  <option></option>
                  {states
                    .filter((state) => state.country === country)[0]
                    .cities.map((city, index) => (
                      <option key={index}>{city}</option>
                    ))}
                </select>
              </div>
              <div className="flex gap-8">
                <div>
                  <label className="text-sm" htmlFor="country">
                    Country
                  </label>
                  <select
                    {...register("country")}
                    className="w-[180px] mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                    type="text"
                    id="country"
                  >
                    <option>{getValues("birthPlace")}</option>
                    {countries.map((country, index) => {
                      return <option key={index}>{country}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-sm" htmlFor="zipCode">
                    Zip code
                  </label>
                  <input
                    {...register("zipCode")}
                    className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                    type="text"
                    id="zipCode"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm" htmlFor="optional">
                  Optional
                </label>
                <input
                  {...register("optional")}
                  className="w-full mt-2 h-11 px-4 border-[#B9B9C3] border-b-[1px]"
                  type="text"
                  id="optional"
                />
              </div>
            </div>
            <button
              className="flex gap-2 items-center h-12 px-8 bg-[#007AFF] text-white rounded font-medium"
              type="Submit"
              onClick={async () => {
                const output = await trigger(
                  ["address", "city", "country", "zipCode", "optional"],
                  {
                    shouldFocus: true,
                  }
                );
                if (!output) return;
              }}
            >
              <img src={tickIcon} alt="tick" />
              Save
            </button>
          </>
        )}
      </form>
    </div>
  );
}
