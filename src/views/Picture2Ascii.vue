<template>
    <div>
        <Navbar/>
        <b-container class="pt-4 pb-4">
            <p>Upload image to convert to ASCII characters.</p>
            <b-form-file
                    v-model="file"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
            ></b-form-file>
            <p class="mt-3">Selected file: {{ file ? file.name : '' }}</p>
            <b-alert v-if="file"
                     variant="info"
                     show
                     dismissible>
                <b-icon-info-circle/>
                Preview shows how much the image needs to be stretched so that ASCII image has the same ratio as the
                original image.
            </b-alert>
            <section class="result-show">
                <canvas id="imgCanvas" :width="MAXIMUM_WIDTH" :height="MAXIMUM_HEIGHT"></canvas>
                <b-button v-if="file" class="m-2" variant="info" @click="downloadResult">
                    <b-icon-download/>
                    Download result
                </b-button>
                <pre id="asciiResult"></pre>
            </section>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";

    export default {
        name: "Picture2Ascii",
        components: {
            Navbar
        },
        data() {
            return {
                file: null,
                MAXIMUM_WIDTH: 320,
                MAXIMUM_HEIGHT: 320,
                successAudio: new Audio(require('@/assets/success.mp3'))
            };
        },
        updated() {
            if (this.file === null || this.file.type.indexOf("image") === -1) {
                alert("Uploaded file must be image.")
                return;
            }
            this.loadAndProcessImage();
        },
        methods: {
            loadAndProcessImage() {
                const canvas = document.getElementById('imgCanvas');
                const ctx = canvas.getContext('2d');
                const img = new Image;
                img.onload = () => {
                    const [width, height] = this.clampDimensions(img.width, img.height);
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    this.processImage();
                }
                img.src = URL.createObjectURL(this.file);
            },

            processImage() {
                const canvas = document.getElementById('imgCanvas');
                const ctx = canvas.getContext('2d');
                const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const px = img.data;
                const chars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
                const grayScales = [];
                for (let i = 0; i < px.length; i += 4) {
                    const r = px[i];
                    const g = px[i + 1];
                    const b = px[i + 2];

                    const grayScale = this.toGrayScale(r, g, b);
                    px[i] = px[i + 1] = px[i + 2] = grayScale;

                    grayScales.push(grayScale);
                }

                document.getElementById('asciiResult').textContent = grayScales.reduce((asciiImage, grayScale, index) => {
                    let nextChars = chars[Math.ceil(((chars.length - 1) * grayScale) / 255)];

                    if ((index + 1) % canvas.clientWidth === 0) {
                        nextChars += "\n";
                    }

                    return asciiImage + nextChars;
                }, "");

                this.playSuccessSound();
            },

            toGrayScale(r, g, b) {
                return 0.21 * r + 0.72 * g + 0.07 * b;
            },

            getFontRatio() {
                const pre = document.createElement("pre");
                pre.style.display = "inline";
                pre.textContent = " ";

                document.body.appendChild(pre);
                const {width, height} = pre.getBoundingClientRect();
                document.body.removeChild(pre);

                return height / width;
            },

            clampDimensions(width, height) {
                const rectifiedWidth = Math.floor(this.getFontRatio() * width);

                if (width > this.MAXIMUM_WIDTH) {
                    const reducedHeight = Math.floor(height * this.MAXIMUM_WIDTH / rectifiedWidth);
                    return [this.MAXIMUM_WIDTH, reducedHeight];
                }

                if (height > this.MAXIMUM_HEIGHT) {
                    const reducedWidth = Math.floor(rectifiedWidth * this.MAXIMUM_HEIGHT / height);
                    return [reducedWidth, this.MAXIMUM_HEIGHT];
                }

                return [rectifiedWidth, height];
            },

            downloadResult() {
                const result = document.getElementById('asciiResult').textContent;
                const el = document.createElement('a');
                el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
                el.setAttribute('download', "asciiImage");
                document.body.appendChild(el);
                el.click();
                document.body.removeChild(el);
            },

            playSuccessSound() {
                this.successAudio.currentTime = 0;
                this.successAudio.play();
            }
        }
    }
</script>

<style scoped>
    .result-show {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    #asciiResult {
        max-width: 100%;
        overflow: auto;
        font-size: .1rem;
    }
</style>