export default function PrivacyPage() {
  return (
      <article className="mx-auto max-w-3xl rounded-xl bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          プライバシーポリシー
        </h1>

        <p className="mb-10 text-sm text-gray-500">
          最終更新日：2026年9月16日
        </p>

        <div className="space-y-5 leading-7">
          <p>
            「席マネ」（以下「本サービス」といいます。）は、個人が運営する小規模イベント向けの座席配置図作成・座席割り当てWebアプリです。
          </p>

          <p>
            本プライバシーポリシーでは、本サービスにおける情報の取扱いについて定めます。
          </p>
        </div>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第1条（基本方針）
          </h2>

          <div className="space-y-5 leading-7">
            <p>
              本サービスでは、利用者が入力した座席配置、参加者情報、割り当て条件その他のデータを、運営者が管理するサーバー上のデータベースに保存することはありません。
            </p>

            <p>
              利用者が本サービスに入力したデータは、原則として利用者の端末上のブラウザのローカルストレージ（localStorage）に保存されます。
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第2条（本サービスで入力される情報）
          </h2>

          <div className="space-y-5 leading-7">
            <p>
              本サービスでは、座席配置図の作成や座席割り当てのため、利用者が任意で以下のような情報を入力することがあります。
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>参加者の氏名・識別名</li>
              <li>参加者の属性</li>
              <li>座席に関する情報</li>
              <li>座席割り当ての条件</li>
              <li>その他、利用者が本サービスに入力する情報</li>
            </ul>

            <p>
              これらの情報は、本サービスの利用者自身が入力するものであり、運営者が積極的に収集するものではありません。
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第3条（情報の保存および送信）
          </h2>

          <ol className="list-decimal space-y-4 pl-6 leading-7">
            <li>
              本サービスにおいて利用者が入力した座席配置、参加者情報、割り当て条件その他のデータは、原則として利用者の端末上のブラウザのローカルストレージ（localStorage）に保存されます。
            </li>

            <li>
              前項のデータについて、運営者が管理するデータベース等への保存は行っていません。また、本サービスの機能として、これらのデータを運営者へ送信する処理は行っていません。
            </li>

            <li>
              ただし、本サービスはCloudflare Pages等のホスティングサービスを利用して提供されています。そのため、本サービスへのアクセスに伴い、IPアドレス、アクセス日時、リクエストに関する情報その他の技術的な情報が、Cloudflareその他のサービス提供者によって処理される場合があります。
            </li>

            <li>
              前項の情報の取扱いについては、各サービス提供者のプライバシーポリシー等が適用されます。
            </li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第4条（個人情報の第三者提供）
          </h2>

          <div className="space-y-5 leading-7">
            <p>
              運営者は、本サービスを通じて取得した利用者の入力データを第三者に提供することはありません。
            </p>

            <p>
              ただし、法令に基づく場合その他法令上認められる場合は、この限りではありません。
            </p>

            <p>
              なお、利用者がローカルストレージに保存した情報については、運営者がその内容を取得して第三者に提供することはできません。
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第5条（ローカルストレージに関する注意事項）
          </h2>

          <ol className="list-decimal space-y-4 pl-6 leading-7">
            <li>
              本サービスでは、利用者が入力したデータをブラウザのローカルストレージに保存します。
            </li>

            <li>
              ローカルストレージに保存されたデータは、ブラウザのデータ削除、ブラウザの設定変更、端末の初期化その他の事情により失われる場合があります。
            </li>

            <li>
              本サービスを利用する端末やブラウザを変更した場合、保存されたデータを引き継げない場合があります。
            </li>

            <li>
              利用者は、必要に応じて自身でデータのバックアップを行うものとします。
            </li>

            <li>
              運営者は、ローカルストレージに保存されたデータの消失、破損等について責任を負いません。
            </li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第6条（個人情報の取扱いに関する注意）
          </h2>

          <div className="space-y-5 leading-7">
            <p>
              本サービスでは、利用者が参加者の氏名その他の個人情報を入力することができます。
            </p>

            <p>
              利用者は、本サービスに個人情報を入力する場合、必要な範囲で適切に取り扱い、第三者の個人情報を不必要に入力しないようにしてください。
            </p>

            <p>
              本サービスは、個人情報をサーバー上で管理することを目的としたサービスではありません。
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第7条（座席割り当て機能について）
          </h2>

          <div className="space-y-5 leading-7">
            <p>
              本サービスでは、参加者の属性、座席に設定された条件等に基づいて座席を自動的に割り当てる機能を提供しています。
            </p>

            <p>
              条件付きの座席割り当てでは、一定のアルゴリズムに基づいて割り当てを行うため、必ずしも利用者が意図する最適な結果が得られることを保証するものではありません。
            </p>

            <p>
              利用者は、必要に応じて割り当て結果を確認・修正したうえで利用してください。
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第8条（本ポリシーの変更）
          </h2>

          <div className="space-y-5 leading-7">
            <p>
              運営者は、必要に応じて本プライバシーポリシーを変更することがあります。
            </p>

            <p>
              変更後のプライバシーポリシーは、本サービス上に掲載した時点から適用されます。
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900 sm:text-2xl">
            第9条（お問い合わせ）
          </h2>

          <div className="space-y-5 leading-7">
            <p>
              本プライバシーポリシーに関するお問い合わせは、以下の窓口までご連絡ください。
            </p>

            <p className="rounded-lg bg-gray-100 p-4 text-black">
              お問い合わせはXからお願いいたします。 @kudayi_app
            </p>
          </div>
        </section>

        <p className="mt-12 border-t border-gray-200 pt-6 text-right text-sm text-gray-500">
          以上
        </p>
      </article>
  );
}