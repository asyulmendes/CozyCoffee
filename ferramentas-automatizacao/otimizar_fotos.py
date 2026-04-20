import os
from PIL import Image
from moviepy.editor import VideoFileClip

PASTA_FOTOS_IN = 'assets/backgrounds/originais'
PASTA_FOTOS_OUT = 'assets/backgrounds'

PASTA_VIDEO_IN = 'assets/backgrounds/videos-originais'
PASTA_VIDEO_OUT = 'assets/backgrounds/video'

LARGURA_MAXIMA = 1920
QUALIDADE_WEBP = 80
DURACAO_MAXIMA = 15

def processar_imagens():
    print("🚀 Iniciando a mágica das FOTOS...")
    if not os.path.exists(PASTA_FOTOS_OUT):
        os.makedirs(PASTA_FOTOS_OUT)

    for arquivo in os.listdir(PASTA_FOTOS_IN):
        if arquivo.lower().endswith(('.jpg', '.jpeg', '.png')):
            caminho = os.path.join(PASTA_FOTOS_IN, arquivo)
            
            try:
                with Image.open(caminho) as img:
                    proporcao = LARGURA_MAXIMA / float(img.size[0])
                    altura = int((float(img.size[1]) * float(proporcao)))
                    img = img.resize((LARGURA_MAXIMA, altura), Image.Resampling.LANCZOS)
                    
                    nome_final = os.path.splitext(arquivo)[0] + ".webp"
                    img.save(os.path.join(PASTA_FOTOS_OUT, nome_final), 'webp', quality=QUALIDADE_WEBP, optimize=True)
                    print(f"✅ Foto: {nome_final}")
            except Exception as e:
                print(f"❌ Erro ao processar a foto {arquivo}: {e}")

def otimizar_video_processo():
    print("🎬 Iniciando a mágica dos VÍDEOS...")
    if not os.path.exists(PASTA_VIDEO_OUT):
        os.makedirs(PASTA_VIDEO_OUT)
        
    for arquivo in os.listdir(PASTA_VIDEO_IN):
        if arquivo.lower().endswith(('.mp4', '.mov', '.mkv')):
            caminho_in = os.path.join(PASTA_VIDEO_IN, arquivo)
            nome_puro = os.path.splitext(arquivo)[0]
            
            try:
                video = VideoFileClip(caminho_in)
                
                if video.duration > DURACAO_MAXIMA:
                    video = video.subclip(0, DURACAO_MAXIMA)
                
                if video.w > LARGURA_MAXIMA:
                    video = video.resize(width=LARGURA_MAXIMA)
                
                video = video.without_audio()
                
                caminho_webm = os.path.join(PASTA_VIDEO_OUT, f"{nome_puro}.webm")
                video.write_videofile(caminho_webm, codec='libvpx', audio=False, bitrate="2000k")
                
                caminho_poster = os.path.join(PASTA_VIDEO_OUT, f"{nome_puro}_poster.jpg")
                video.save_frame(caminho_poster, t=1)
                
                video.close()
                print(f"✅ Vídeo e Poster: {nome_puro}")
            except Exception as e:
                print(f"❌ Erro ao processar o vídeo {arquivo}: {e}")

if __name__ == "__main__":
    processar_imagens() 
    otimizar_video_processo()
    print("\n☕ Café pronto! Processamento finalizado.")