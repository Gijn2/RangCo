//@Service
//public class FileService {
//
//    // application.properties에서 설정한 경로를 가져옴
//    @Value("${file.upload-dir}")
//    private String uploadDir;
//
//    public String storeFile(MultipartFile file) {
//        // 1. 원본 파일명 확보
//        String originalFilename = file.getOriginalFilename();
//
//        // 2. 확장자 추출 (예: .jpg)
//        String extension = "";
//        if (originalFilename != null && originalFilename.contains(".")) {
//            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
//        }
//
//        // 3. UUID를 이용한 파일명 암호화 (파일명 중복 방지 및 보안)
//        //
//        String uuid = UUID.randomUUID().toString();
//        String storedFilename = uuid + extension; // 예: 550e8400-e29b-41d4-a716-446655440000.jpg
//
//        try {
//            // 4. 저장 경로 설정 및 파일 저장
//            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(storedFilename);
//            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
//
//            return storedFilename; // DB에는 이 암호화된 파일명을 저장함
//        } catch (IOException ex) {
//            throw new RuntimeException("파일을 저장할 수 없습니다. 다시 시도해주세요.", ex);
//        }
//    }
//}