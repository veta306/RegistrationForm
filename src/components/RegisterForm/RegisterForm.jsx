import { useState } from "react";
import CloseIcon from "../../assets/cross.png";
import LockIcon from "../../assets/lock.png";
import EditIcon from "../../assets/edit.png";
import RefreshIcon from "../../assets/refresh.png";
import { useLoaderData } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
  dialCode: z.string(),
  phoneNumber: z
    .string()
    .min(1)
    .max(15)
    .regex(/^\d+$/, "Phone number must contain only digits"),
  confirmationCode: z.literal("1234", {
    errorMap: () => ({ message: "Code is incorrect, try 1234" }),
  }),
  email: z.string().email(),
  password: z.string().min(8),
});
export default function RegisterForm() {
  const {
    register,
    trigger,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [privacyNotification, setPrivacyNotification] = useState(true);
  const dialCodes = useLoaderData();
  return (
    <div className="w-[456px]">
      <div className="mt-2">
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
      <div className="mt-20">
        <p className="text-3xl font-bold mb-4">Registration</p>
        <p>
          Fill in the registration data. It will take a couple of minutes.
          <br /> All you need is a phone number and e-mail
        </p>
      </div>
      <form action="">
        {currentStep === 0 && (
          <>
            {privacyNotification && (
              <div className="flex my-8 p-4 rounded-lg bg-[#F0F2F4]">
                <img className="w-6 h-6" src={LockIcon} alt="lock" />
                <p className="mx-4 text-sm">
                  We take privacy issues seriously. You can be sure that your
                  personal data is securely protected.
                </p>
                <img
                  className="w-6 h-6 cursor-pointer"
                  src={CloseIcon}
                  alt="close"
                  onClick={() => setPrivacyNotification(false)}
                />
              </div>
            )}
            <div className="my-8 p-8 border-[#B9B9C3] border-[1px] rounded-lg">
              <p>Enter your phone number</p>
              <div className="mt-8">
                <select
                  {...register("dialCode")}
                  className="w-20 mr-4 border-[#B9B9C3] border-b-[1px]"
                  type="text"
                >
                  {dialCodes.map((code, index) => (
                    <option key={index}>{code}</option>
                  ))}
                </select>
                <input
                  {...register("phoneNumber")}
                  className="border-[#B9B9C3] border-b-[1px]"
                  type="text"
                />
                {errors.phoneNumber?.message && (
                  <p className="text-sm text-red-400">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              className="w-[137px] h-12 border-[#BBBFC1] border-[1px] rounded-lg font-medium"
              onClick={async () => {
                const output = await trigger(["dialCode", "phoneNumber"], {
                  shouldFocus: true,
                });
                if (!output) return;
                else setCurrentStep(1);
              }}
            >
              Send Code
            </button>
          </>
        )}
        {currentStep === 1 && (
          <>
            <div className="flex justify-between p-4 my-8 h-20 border-[#BBBFC1] rounded-lg border-[1px]">
              <div className="mr-4">
                <p>{getValues("dialCode") + " " + getValues("phoneNumber")}</p>
                <p className="text-sm">Number not confirmed yet</p>
              </div>
              <img
                className="w-6 h-6 self-end cursor-pointer"
                src={EditIcon}
                alt="edit"
                onClick={() => setCurrentStep(0)}
              />
            </div>
            <div className="flex items-center	my-8">
              <div className="w-[296px] mr-4">
                <p>Confirmation code</p>
                <input
                  {...register("confirmationCode")}
                  className="w-full my-2 h-11 text-lg tracking-widest border-[#B9B9C3] border-b-[1px]"
                  type="text"
                  placeholder=" — — — — "
                />
                {errors.confirmationCode?.message && (
                  <p className="text-sm text-red-400">
                    {errors.confirmationCode.message}
                  </p>
                )}
                <p className="text-sm">
                  Confirm phone number with code from sms message
                </p>
              </div>
              <div className="flex h-8 px-4">
                <img
                  className="h-6 w-6 mr-2 font-medium"
                  src={RefreshIcon}
                  alt="send again"
                />
                <p className="text-[#007AFF]">Send again</p>
              </div>
            </div>
            <button
              type="button"
              className="h-12 px-6 border-[#BBBFC1] rounded-lg border-[1px] font-medium"
              onClick={async () => {
                const output = await trigger(["confirmationCode"], {
                  shouldFocus: true,
                });
                if (!output) return;
                else setCurrentStep(2);
              }}
            >
              Confirm
            </button>
          </>
        )}
        {currentStep === 2 && (
          <>
            <div className="p-4 my-8 h-20 border-[#BBBFC1] rounded-lg border-[1px]">
              <p>{getValues("dialCode") + " " + getValues("phoneNumber")}</p>
              <p className="text-sm">✓ Number confirmed</p>
            </div>
            <div className="p-8 my-8 border-[#BBBFC1] rounded-lg border-[1px]">
              <div>
                <label>Enter your email</label>
                <input
                  {...register("email")}
                  className="w-full my-2 h-11 text-base border-[#B9B9C3] border-b-[1px]"
                  type="email"
                />
                {errors.email?.message && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
              <div className="mt-8">
                <label>Set a password</label>
                <input
                  {...register("password")}
                  className="w-full my-2 h-11 text-base border-[#B9B9C3] border-b-[1px]"
                  type="password"
                />
                {errors.password?.message && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
                <p className="h-5 text-green-600 text-xs">✓ Good password</p>
              </div>
            </div>
            <button
              className="h-12 px-8 bg-[#007AFF] text-white rounded"
              type="button"
              onClick={async () => {
                const output = await trigger(["email", "password"], {
                  shouldFocus: true,
                });
                if (!output) return;
              }}
            >
              Register Now
            </button>
          </>
        )}
      </form>
    </div>
  );
}
