export default function About() {
  return (
    <div className="max-w-6xl mx-auto mt-29 lg:mt-36 mb-24 px-4">
      <div className="bg-base-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-8 gap-4">
          <div className="w-full h-72 md:h-auto overflow-hidden">
            <img src="/home-img.jpg" alt="About Image" className="w-full h-full object-cover rounded-md" />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo, sapien in facilisis gravida, sem purus elementum nisi, sed dictum ligula arcu vel libero.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-3">Nima uchun biz?</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
                <li>Praesent commodo sapien</li>
                <li>Sem purus elementum nisi</li>
                <li>Sed dictum ligula arcu vel libero</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Aloqa</h2>
              <p className="text-gray-700 ">Telegram chat</p>
              <p className="text-gray-700 ">(90) 94 441 1407</p>
              <p className="text-gray-700 ">info@texnikum.uz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
