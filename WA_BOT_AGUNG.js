import dotenv from "dotenv";
dotenv.config();
import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chat = model.startChat({
    history: [], // Start with an empty history
    generationConfig: {
        maxOutputTokens: 200,
    },
});

// Inisialisasi WhatsApp Web Client
const client = new Client();

client.on("qr", (qr) => {
    // Generate QR Code untuk pemindaian
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("WhatsApp Client is ready!");
});

// Event handling untuk pesan masuk
client.on("message", async (msg) => {
    try {
        // Command sederhana
        if (msg.body.toLowerCase() === "halo" ||
            msg.body.toLowerCase() === "selamat pagi" ||
            msg.body.toLowerCase() === "selamat siang" ||
            msg.body.toLowerCase() === "selamat malam" ||
            msg.body.toLowerCase() === "selamat sore" ||
            msg.body.toLowerCase() === "assalamualaikum") {
            msg.reply("Halo! Selamat datang di chatbot PPDB SMA N 1 Ciampel 2025/2026\nPilih salah satu opsi berikut:\n1. Persyaratan Calon Peserta PPDB\n2. Jadwal & Timeline\n3. Cara Pendaftaran PPDB\n4. Kuota PPDB\n5. Chat dengan Operator");
        } else if (msg.body === "1") {
            msg.reply("Persyaratan umum:\n1. KK\n2. Akta Kelahiran\n3. Fotocopy Raport Sekolah asal dari semester 1-5 terlegalisir\nPersyaratan Khusus:\n1. Surat keterangan tidak mampu (PKH/KIP) untuk jalur KETM\n2. Hasil Psikotes dari lembaga terpercaya untuk jalur PDBK\n3. Sertifikat Prestasi Kejuaraan untuk Jalur Kejuaraan");
        } else if (msg.body === "2") {
            msg.reply("Jadwal PPDB Tahap 1:\n" +
                "Pendaftaran dan Submit Dokumen Persyaratan: 3-7 Juni 2025\n" +
                "Uji Kompetensi Jalur Prestasi (SMA): 10-12 Juni 2025\n" +
                "Pengumuman Hasil: 19 Juni 2025\n" +
                "Daftar Ulang: 20-21 Juni 2025\n\n" +
                "Jadwal PPDB Tahap 2:\n" +
                "Pendaftaran dan Submit Dokumen Persyaratan: 24-28 Juni 2025\n" +
                "Uji Bidang Keahlian (SMK): 1-2 Juli 2025\n" +
                "Pengumuman Hasil: 5 Juli 2025\n" +
                "Daftar Ulang: 8-9 Juli 2025");
        } else if (msg.body === "3") {
            msg.reply("Proses pendaftaran PPDB untuk jenjang SMA/SMK/SLB di Jawa Barat dapat diakses secara mobile melalui Aplikasi Jabar Super App: Sapawarga, yang dapat diunduh pada Play Store maupun App Store, atau melalui website ppdb.jabarprov.go.id.\n\n" +
                "Selain itu, pendaftaran PPDB juga dapat dilakukan secara langsung dengan mengunjungi sekolah tujuan dan membawa serta melengkapi semua berkas dokumen persyaratan PPDB untuk didaftarkan secara manual oleh panitia sekolah.");
        } else if (msg.body === "4") {
            msg.reply("Kuota PPDB SMA N 1 Ciampel:\n" +
                "1. Perpindahan tugas Ortu/Anak Guru = 16 Orang\n" +
                "2. Prestasi Raport = 70 Orang\n" +
                "3. Peserta Didik Berkebutuhan Khusus (PDBK) = 16 Orang\n" +
                "4. Zonasi = 157 Orang\n" +
                "5. Prestasi Kejuaraan = 16 Orang\n" +
                "6. Keluarga Ekonomi Tidak Mampu (KETM) = 49 Orang\n" +
                "Total Kuota = 324 Orang");
        } else if (msg.body === "5") {
            msg.reply("Terima kasih atas pesan Anda, kami akan merespon secepat mungkin, sesuai jam kerja 08.00-15.00 WIB.");
        } else {
            // Menggunakan Gemini AI untuk menjawab pertanyaan
            const result = await chat.sendMessage(msg.body);
            msg.reply(result.response.text); // Kirimkan jawaban ke WhatsApp
        }
    } catch (error) {
        console.error("Error handling message:", error);
        msg.reply("Pilihan yang anda masukkan salah");
    }
});

// Inisialisasi bot
client.initialize();
