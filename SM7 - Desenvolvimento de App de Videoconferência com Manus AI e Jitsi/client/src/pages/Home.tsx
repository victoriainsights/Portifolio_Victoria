import { useState } from "react";
import { Phone, Camera, LogOut, CheckCircle, Shield, Users, Heart } from "lucide-react";
import JitsiMeetSimulator from "@/components/JitsiMeetSimulator";

export default function Home() {
  const [showJitsi, setShowJitsi] = useState(false);

  if (showJitsi) {
    return <JitsiMeetSimulator onClose={() => setShowJitsi(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header com Logo */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663031778473/jzK2KgJVURGZBUAj3Tz4A4/neto-digital-logo-mzETsz25vu93Y8fDJWrkWP.webp"
              alt="Neto Digital Logo"
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Neto Digital</h1>
              <p className="text-xs text-gray-600">Conectando famílias, cuidando de quem importa</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Conteúdo Hero */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Sua família está a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">apenas um toque</span> de distância
                </h2>
                <p className="text-xl text-gray-700">
                  Conecte-se com seus familiares e receba suporte profissional sempre que precisar. Tudo de forma segura e simples.
                </p>
              </div>

              {/* Benefícios */}
              <div className="space-y-4 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">100% Seguro e Privado</h3>
                    <p className="text-sm text-gray-600">Seus dados estão protegidos com criptografia de ponta a ponta</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Videochamadas Instantâneas</h3>
                    <p className="text-sm text-gray-600">Fale com seus netos e agentes de suporte em tempo real</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Heart className="w-6 h-6 text-red-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Suporte Dedicado</h3>
                    <p className="text-sm text-gray-600">Agentes treinados prontos para ajudar com suas contas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663031778473/jzK2KgJVURGZBUAj3Tz4A4/neto-digital-hero-jKWafX3P8dumhtTyx5vGon.webp"
                alt="Idosos usando Neto Digital"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><defs><pattern id=%22grid%22 width=%22100%22 height=%22100%22 patternUnits=%22userSpaceOnUse%22><path d=%22M 100 0 L 0 0 0 100%22 fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22/></pattern></defs><rect width=%22100%22 height=%22100%22 fill=%22url(%23grid)%22/></svg>')]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Comece Agora - É Simples e Rápido
          </h2>
          <p className="text-xl text-blue-50">
            Três botões gigantes, fáceis de usar. Tudo foi pensado para você.
          </p>

          {/* Botões Principais */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Botão Verde - Pedir Ajuda por Vídeo */}
            <button
              onClick={() => setShowJitsi(true)}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative p-8 flex flex-col items-center justify-center min-h-48 gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Phone size={40} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">
                  PEDIR AJUDA POR VÍDEO
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Fale com um agente de suporte agora mesmo
                </p>
              </div>
            </button>

            {/* Botão Azul - Tirar Foto da Conta */}
            <button
              onClick={() => {
                alert("📸 Câmera aberta! Tire uma foto de sua conta e envie para o suporte.");
              }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative p-8 flex flex-col items-center justify-center min-h-48 gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Camera size={40} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">
                  TIRAR FOTO DA CONTA
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Compartilhe sua conta com segurança
                </p>
              </div>
            </button>

            {/* Botão Vermelho - Sair */}
            <button
              onClick={() => {
                if (confirm("Deseja realmente sair do aplicativo?")) {
                  alert("Aplicativo fechado. Até logo!");
                }
              }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative p-8 flex flex-col items-center justify-center min-h-48 gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <LogOut size={40} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">
                  SAIR
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Fechar o aplicativo
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Por que escolher <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Neto Digital</span>?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Interface Simples</h3>
                  <p className="text-gray-600 mt-2">
                    Botões grandes e claros. Sem complicações. Tudo pensado para ser fácil de usar.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Suporte 24/7</h3>
                  <p className="text-gray-600 mt-2">
                    Agentes de suporte disponíveis sempre que você precisar de ajuda.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Conecte com Familiares</h3>
                  <p className="text-gray-600 mt-2">
                    Vídeo chamadas com seus netos e filhos. Sempre conectado com quem você ama.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Totalmente Seguro</h3>
                  <p className="text-gray-600 mt-2">
                    Seus dados são protegidos. Criptografia de ponta a ponta em todas as chamadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Pronto para se conectar com sua família?
          </h2>
          <p className="text-lg text-gray-600">
            Clique no botão verde acima para começar sua primeira videochamada agora mesmo.
          </p>
          <button
            onClick={() => setShowJitsi(true)}
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Iniciar Videochamada Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Sobre Neto Digital</h4>
              <p className="text-sm">
                Conectando gerações através da tecnologia. Segurança, simplicidade e cuidado.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Segurança</h4>
              <p className="text-sm">
                Conformidade com LGPD. Dados criptografados. Privacidade garantida.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <p className="text-sm">
                Dúvidas? Entre em contato com nosso suporte 24/7.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Neto Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
