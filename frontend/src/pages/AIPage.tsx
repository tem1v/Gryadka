import React, {useState, useCallback, type Key} from 'react';
import { LucideLoader, LucideX, LucideUpload, LucideTrash2, LucidePlus } from 'lucide-react';
import {Card, Label, ListBox, Select} from "@heroui/react";
import {Carousel} from "@/components/Carousel.tsx";

interface UploadedFile {
  fileObject: File;
  preview: string;
  id: string;
}

interface Props {

}

export interface PredictionResponse {
  data: {
    images: {
      filename: string;
      plant: string;
      label: string;
      confidence: number
    }[];
    overall:{
      label: string;
      confidence: number;
      disease_name_ru: string;
      description: string;
      treatment: string;
    }
  }
}

export function AIPage(props: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Key | null>(null); // Изменено: храним Key
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const items = [
    { label: "Картофель", id: "Картофель" },
    { label: "Помидор", id: "Помидор" },
    { label: "Перец", id: "Перец" },
  ];

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      fileObject: file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleClearAll = useCallback(() => {
    uploadedFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setUploadedFiles([]);
  }, [uploadedFiles]);

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0 || !selectedPlant) return;

    setIsUploading(true);

    try {
      const formData = new FormData();

      uploadedFiles.forEach((file: UploadedFile) => {
        if (file.fileObject) {
          formData.append('files', file.fileObject as File);
        }
      });

      formData.append('plant', selectedPlant as string);

      const response = await fetch('http://localhost:8000/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      const result: PredictionResponse = await response.json();
      setIsOpen(true);
      setPredictionResult(result);
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось отправить файлы');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReturn = () => {
    handleClearAll();
    setIsOpen(false);
  };

  return (
    <>
      <div className='flex flex-col justify-center gap-6 transition-all duration-100 ease-linear mx-auto mt-25 max-w-[1480px]'>
        {!isOpen && (
          <div className='flex flex-col justify-center gap-6 transition-all duration-100 ease-linear'>
            <h1>
              Диагностика
            </h1>

            <Select
              className="w-full"
              placeholder="Выберите растение"
              selectedKeys={selectedPlant ? [selectedPlant] : []}
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setSelectedPlant(null);
                  return;
                }

                const selectedKey = keys instanceof Set
                  ? Array.from(keys)[0]
                  : keys === "all" ? null : keys;

                setSelectedPlant(selectedKey || null);
              }}
            >
              <Label>Выберите растение</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {items.map((i) => (
                    <ListBox.Item key={i.id} id={i.id} textValue={i.label}>
                      {i.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <div className="space-y-4">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${isDragging
                  ? 'border-[#2E7700] bg-[#2E7700]/5 scale-[0.99]'
                  : 'border-gray-300 hover:border-[#2E7700] hover:bg-[#2E7700]/5'
                }
                  ${uploadedFiles.length > 0 ? 'bg-gray-50' : 'bg-white'}
                `}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />

                <div className="flex flex-col items-center gap-3">
                  <div className={`
                    p-4 rounded-full transition-all duration-200
                    ${isDragging ? 'bg-[#2E7700] text-white' : 'bg-gray-100 text-[#2E7700]'}
                  `}>
                    <LucideUpload size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {isDragging ? 'Отпустите для загрузки' : 'Перетащите фото сюда'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      или нажмите для выбора файлов
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Поддерживаются: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                      Загружено файлов: {uploadedFiles.length}
                    </p>
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <LucideTrash2 size={16} />
                      Очистить все
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <img
                          src={file.preview}
                          alt={file.fileObject.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(file.id);
                            }}
                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <LucideX size={20} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                          {file.fileObject.name.length > 20
                            ? file.fileObject.name.substring(0, 17) + '...'
                            : file.fileObject.name}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => document.getElementById('file-input')?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#2E7700] hover:bg-[#2E7700]/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#2E7700]"
                    >
                      <LucidePlus size={32} strokeWidth={1.5} />
                      <span className="text-xs">Добавить ещё</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className={`
                w-full h-14 bg-[#2E7700] transition-all duration-200 ease-in-out
                text-white font-bold rounded-xl text-lg
                ${uploadedFiles.length === 0 || !selectedPlant || isUploading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-80 hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg'
              }
              `}
              onClick={handleSubmit}
              disabled={uploadedFiles.length === 0 || !selectedPlant || isUploading}
            >
              {uploadedFiles.length === 0
                ? 'Загрузите фотографии'
                : !selectedPlant
                  ? 'Выберите растение'
                  : isUploading
                    ? <span className="flex items-center justify-center gap-2"><LucideLoader className="animate-spin" /> Отправка...</span>
                    : 'Получить диагностику'}
            </button>
          </div>
        )}

        {isOpen && (
          <div className="space-y-6">
            <Carousel items={predictionResult?.data.images} files={uploadedFiles}/>
            <Card>
              <h3
                className='font-bold text-[#2E7700] text-[24px] transition-all duration-100 ease-linear md:text-[32px]'>
                {(predictionResult?.data.overall.label === "Здорово")
                  ? `Растение здоровое (Вероятность: ${predictionResult?.data.overall?.confidence} %)`
                  : `${predictionResult?.data.overall?.label} (Вероятность: ${predictionResult?.data.overall?.confidence} %)`}
              </h3>
              <div>
                <h3>Описание</h3>
                <span>{predictionResult?.data.overall.description}</span>
              </div>
              <div>
                <h3>Рекомендации</h3>
                <span className='whitespace-pre-wrap'>{predictionResult?.data.overall.treatment}</span>
              </div>
            </Card>
            <button
              className={`
                w-full h-14 bg-[#2E7700] transition-all duration-200 ease-in-out
                text-white font-bold rounded-xl hover:opacity-80 hover:scale-[1.02] 
                cursor-pointer shadow-md hover:shadow-lg
              `}
              onClick={handleReturn}
            >
              Загрузить новые фото
            </button>
          </div>
        )}
      </div>
    </>
  );
}