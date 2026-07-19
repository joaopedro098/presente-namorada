'use client';

import { CldUploadButton } from 'next-cloudinary';
import { useState } from 'react';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';

// 1. CORREÇÃO: Mudamos o nome da propriedade para bater com o MuralFotos (onUploadCompleto)
interface UploadBotaoProps {
  onUploadCompleto: (url: string) => void;
}

export default function UploadBotao({ onUploadCompleto }: UploadBotaoProps) {
  const [uploadedImage, setUploadedImage] = useState<CloudinaryUploadWidgetInfo | null>(null);

  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center">
      {/* 2. ESTILIZAÇÃO: Trocamos o style inline por Tailwind CSS combinando com o tema rosa */}
      <div className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors shadow-sm border border-pink-200 inline-block text-center text-sm">
        <CldUploadButton
          uploadPreset="carregar fotos"
          onSuccess={(result) => {
            if (result.info && typeof result.info !== 'string') {
              const info = result.info as CloudinaryUploadWidgetInfo;
              setUploadedImage(info);
              
              // Envia a url segura diretamente para a função do Mural de Fotos
              onUploadCompleto(info.secure_url);
              console.log('Upload bem-sucedido:', info);
            }
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close();
          }}
        >
          Adione a nova foto da memoria 
        </CldUploadButton>
      </div>

      {/* Feedback visual sutil */}
      {uploadedImage && (
        <p className="text-xs text-green-600 font-semibold mt-1">
          📸 Imagem carregada com sucesso!
        </p>
      )}
    </div>
  );
}