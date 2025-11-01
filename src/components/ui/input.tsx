import * as React from "react";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={"h-10 w-full rounded-md border px-3 "+(props.className||"")} />;
}
