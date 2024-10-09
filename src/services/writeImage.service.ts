import * as fs from 'fs';
import * as path from 'path';
import Jimp from 'jimp';
import sharp from 'sharp';

interface TextOptions {
	text: string;
	x: number;
	y: number;
	fontSize: number;
	fontStyle: 'black' | 'blackItalic' | 'white' | 'whiteItalic';
}

type JimpFont = 
  | 'FONT_SANS_8_BLACK'
  | 'FONT_SANS_16_BLACK'
  | 'FONT_SANS_32_BLACK'
  | 'FONT_SANS_64_BLACK'
  | 'FONT_SANS_128_BLACK'
  | 'FONT_SANS_8_WHITE'
  | 'FONT_SANS_16_WHITE'
  | 'FONT_SANS_32_WHITE'
  | 'FONT_SANS_128_WHITE';


class writeIamge {

	getFontKey(fontSize: number, fontStyle: string): JimpFont {
		const size = fontSize as 8 | 16 | 32 | 64 | 128;
		const style = fontStyle === 'blackItalic' ? 'BLACK_ITALIC' :
					  fontStyle === 'whiteItalic' ? 'WHITE_ITALIC' :
					  fontStyle.toUpperCase();
		return `FONT_SANS_${size}_${style}` as JimpFont;
	  }

	async  writeTextOnImage(
		inputImagePath: string,
		outputImagePath: string,
		textOptions: TextOptions
	  ): Promise<void> {
		try {
		  // Carrega a imagem
		  const image = await Jimp.read(inputImagePath);
	  
		  // Carrega a fonte
		  const fontKey = this.getFontKey(textOptions.fontSize, textOptions.fontStyle);
		  const font = await Jimp.loadFont(Jimp[fontKey]);
	  
		  // Escreve o texto na imagem
		  image.print(
			font,
			textOptions.x,
			textOptions.y,
			textOptions.text
		  );
	  
		  // Salva a imagem
		  await image.writeAsync(outputImagePath);
	  
		  console.log('Texto escrito na imagem com sucesso!');
		} catch (error) {
		  console.error('Erro ao processar a imagem:', error);
		}
	}
	  
	async writePassport(date:string) {

		// Exemplo de uso
		const inputImagePath = '/home/monkey/Área de Trabalho/collection-image-passport.png';
		const outputImagePath = '/home/monkey/Área de Trabalho/collection-image-passport1.png';

		console.log({date})
		  
		const textOptions: TextOptions = {
			text: date,
			x: 641+41-7,
			y: 284+17.5-11,
			fontSize: 64,
			fontStyle: 'black'
		};

		await this.writeTextOnImage(inputImagePath, outputImagePath, textOptions);
	
		return "dale image"
		
	}

	async  addWatermark(inputPath: string, outputPath: string) {
		try {
			const image = sharp(inputPath);
			const metadata = await image.metadata();
	
			const width = metadata.width || 1000;
			const height = metadata.height || 1000;
	
			const svg = `
				<svg width="${width}" height="${height}">
					<style>
						.title { 
							fill: rgba(255, 0, 0, 0.6); 
							font-size: 350px; 
							font-weight: bold; 
							font-family: Arial, sans-serif;
						}
					</style>
					<text x="50%" y="65%" text-anchor="middle" class="title" transform="rotate(-30, ${width/2}, ${height/2})">TEST</text>
				</svg>
			`;
	
			await image
				.composite([
					{
						input: Buffer.from(svg),
						top: 0,
						left: 0,
					},
				])
				.toFile(outputPath);
	
			console.log(`Processado: ${path.basename(inputPath)}`);
		} catch (error) {
			console.error(`Erro ao processar ${inputPath}:`, error);
		}
	}
	

	async addTestImage(date:string) {

		// Exemplo de uso
		const inputFolder = '/home/monkey/Área de Trabalho/aliens';
		const outputFolder = '/home/monkey/Área de Trabalho/aliens-test';

		const files = fs.readdirSync(inputFolder);

		if (!fs.existsSync(outputFolder)) {
			fs.mkdirSync(outputFolder);
		}

		for (const file of files) {
			if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
				const inputPath = path.join(inputFolder, file);
				const outputPath = path.join(outputFolder, file);
				await this.addWatermark(inputPath, outputPath);
			}
		}
	
		return "dale image"
		
	}

}

export default new writeIamge();
