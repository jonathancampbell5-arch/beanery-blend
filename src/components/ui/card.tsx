import * as React from "react";
export function Card({ className="", children }: any){ return <div className={`rounded-2xl border bg-white ${className}`}>{children}</div>; }
export function CardHeader({ className="", children }: any){ return <div className={`p-5 border-b ${className}`}>{children}</div>; }
export function CardContent({ className="", children }: any){ return <div className={`p-5 ${className}`}>{children}</div>; }
export function CardTitle({ className="", children }: any){ return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>; }
export function CardDescription({ className="", children }: any){ return <p className={`text-sm text-neutral-600 ${className}`}>{children}</p>; }
