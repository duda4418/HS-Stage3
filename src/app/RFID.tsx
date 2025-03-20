import Link from "next/link";

export default function RFID() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="loader">
        <div className="box">
          <Link href="/login">
            <div className="logo"></div>
          </Link>
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
      <p className="pt-20 text-black">Please scan your RFID tag...</p>
    </div>
  );
}
