import { useState, useEffect } from "react";
import { X, Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";

interface JitsiMeetSimulatorProps {
  onClose: () => void;
}

export default function JitsiMeetSimulator({ onClose }: JitsiMeetSimulatorProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Video area simulado */}
      <div className="flex-1 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
        {/* Local video (você) - canto inferior direito */}
        <div className="absolute bottom-6 right-6 w-32 h-40 bg-gray-700 rounded-lg border-4 border-white shadow-lg flex items-center justify-center">
          <div className="text-center">
            {isVideoOff ? (
              <div className="text-white text-center">
                <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <p className="text-xs font-semibold">Você</p>
              </div>
            ) : (
              <div className="text-white text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-3xl">😊</span>
                </div>
                <p className="text-xs font-semibold">Você</p>
              </div>
            )}
          </div>
        </div>

        {/* Remote video (suporte) - centro */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-56 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">👨‍💼</div>
              <p className="text-white font-bold text-lg">Agente de Suporte</p>
            </div>
          </div>

          {/* Duração da chamada */}
          <div className="text-white text-4xl font-bold font-mono">
            {formatTime(callDuration)}
          </div>
          <p className="text-gray-400 mt-2">Chamada em andamento</p>
        </div>

        {/* Room name */}
        <div className="absolute top-6 left-6 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
          <p className="text-sm font-semibold">Sala: Suporte_NetoDigital_Privado</p>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-gray-900 border-t border-gray-700 px-6 py-6 flex items-center justify-center gap-6">
        {/* Botão Microfone */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 ${
            isMuted
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          aria-label={isMuted ? "Ativar microfone" : "Desativar microfone"}
        >
          {isMuted ? (
            <MicOff size={32} className="text-white" />
          ) : (
            <Mic size={32} className="text-white" />
          )}
        </button>

        {/* Botão Vídeo */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 ${
            isVideoOff
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          aria-label={isVideoOff ? "Ativar câmera" : "Desativar câmera"}
        >
          {isVideoOff ? (
            <VideoOff size={32} className="text-white" />
          ) : (
            <Video size={32} className="text-white" />
          )}
        </button>

        {/* Botão Encerrar Chamada */}
        <button
          onClick={onClose}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95"
          aria-label="Encerrar chamada"
        >
          <Phone size={32} className="text-white rotate-225" />
        </button>
      </div>

      {/* Botão fechar (X) - canto superior esquerdo */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-200"
        aria-label="Fechar simulador"
      >
        <X size={24} />
      </button>

      {/* Info box */}
      <div className="absolute bottom-24 left-6 bg-black bg-opacity-70 text-white px-4 py-3 rounded-lg max-w-xs">
        <p className="text-sm font-semibold mb-2">ℹ️ Simulação do Jitsi Meet</p>
        <p className="text-xs text-gray-300">
          Este é um protótipo de demonstração. No app Android real, você se conectará a uma sala de suporte ao vivo.
        </p>
      </div>
    </div>
  );
}
