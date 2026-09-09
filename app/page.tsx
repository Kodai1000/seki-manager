import Link from 'next/link';
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center py-6 bg-white rounded">
      {/* ヒーローセクション */}
      <div className="w-full max-w-3xl text-center space-y-2 mb-16 p-2 space-y-8 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">
          席決めの面倒を、もっとスムーズに。
        </h1>
        <div className="flex justify-center items-center gap-4">
          <Image
              src="/images/sekimane_icon_seats.svg"
              alt="席マネ"
              width={72}
              height={72}
              className="inline-block mr-2"  
            />
            <h1 className="text-3xl font-bold">席マネ</h1>
          </div>
        <p className="text-gray-700">
          「席マネ」は、直感的な操作と自動割り当て機能で、イベントの座席配置を作成できるWebアプリです。
        </p>
        <div>
          <Link
            href="/work"
            className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm shadow-sm"
          >
            今すぐ使ってみる
          </Link>
        </div>
      </div>

      {/* 特徴セクション（3つの特徴） */}
      <div className="w-full max-w-4xl grid sm:grid-cols-3 gap-6 mb-16">
        {/* 特徴 1 */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-sky-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 block mb-2">01</span>
            <h3 className="font-bold text-gray-900 mb-2 text-base">
              ドラッグ&クリックで作成
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              ドラッグやクリックなどの直感的操作で座席表を作成できます。
            </p>
          </div>
        </div>

        {/* 特徴 2 */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-sky-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 block mb-2">02</span>
            <h3 className="font-bold text-gray-900 mb-2 text-base">
              自動割り当て機能
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              ランダムな割り当てのほか、席の位置や属性に応じた制約を持たせた割り当てが可能です。
            </p>
          </div>
        </div>

        {/* 特徴 3 */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-sky-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 block mb-2">03</span>
            <h3 className="font-bold text-gray-900 mb-2 text-base">
              ローカル保存 & 画像出力
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              データはサーバーに送信されずローカルストレージに保存。PNG画像としてダウンロードできます。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}