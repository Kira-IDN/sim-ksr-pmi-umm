# Panduan Kontribusi

Terima kasih telah tertarik untuk berkontribusi pada Sistem Informasi KSR PMI UMM! 

## Alur Kontribusi
1. **Pilih atau Buat Issue**: Pastikan pekerjaan yang akan Anda lakukan sudah tercatat di GitHub Issues.
2. **Buat Branch Baru**: Buat branch baru dari `main` dengan format penamaan:
   - Fitur baru: `feature/nama-fitur`
   - Perbaikan bug: `bugfix/nama-bug`
   - Refactor: `refactor/nama-modul`
3. **Commit Messages**: Gunakan [Conventional Commits](https://www.conventionalcommits.org/). Contoh:
   - `feat: add user profile page`
   - `fix: resolve sidebar collapse issue`
4. **Pull Request (PR)**:
   - Berikan deskripsi yang jelas mengenai apa yang diubah.
   - Cantumkan Issue yang diselesaikan (e.g., `Closes #12`).
   - Tunggu *code review* dari maintainer sebelum *merge*.

## Standar Kode
- Gunakan TypeScript secara *strict*.
- Pastikan kode Anda lolos linter (ESLint) dan formatter (Prettier).
- Semua komponen React sebaiknya menggunakan *functional components* dan *hooks*.
- Hindari penggunaan *state management global* yang berlebihan jika *state* hanya digunakan secara lokal. Gunakan React Query untuk *server state*.

Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk berdiskusi di bagian GitHub Discussions/Issues.
