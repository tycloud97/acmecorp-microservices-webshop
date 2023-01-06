## Intro

- Giới thiệu chủ đề distributed tracing và đến từ Viet-AWS

- Các bạn đã nhìn thấy slide chưa nhỉ?

- Thông qua phần chia sẻ của anh Hoàng và anh Linh thì mọi người đã hiểu được vấn đề...

- Vấn đề rất phổ biến của Microservices, giúp truy vết lỗi và hành động của người dùng...

## Content

Giới thiệu nội dung trình bày:

- Giới thiệu Distributed tracing

- Cách hoạt động

- Demo giao diện AWS, cách hoạt động và lấy ra các log liên quan tới request gửi email

# Distributed tracing là gì?

Là phương thức để truy vết các request hoặc message đi qua hệ thống phân tán...

Lấy ví dụ: Dịch vụ này gọi dịch vụ kia.

Mục đích:

- Phù hợp cho các mô hình có sự phụ thuộc phức tạp.

- Tập trung các log liên quan để dễ dàng debug lỗi.

- Giảm sự phức tạp.

- Tập trung các công việc business.

# Question: Hỏi xem anh chị nào đã từng nghe về thuật ngữ này chưa?

# Ví dụ về việc truy vết 1 bệnh nhân covid

- Giới thiệu về việc truy vết, điều tra lộ trình di chuyển của bệnh nhân covid...

- Giới thiệu không có chuyên môn y tế, ví dụ chỉ mang tính chất tham khảo, mong mọi người bỏ qua nếu thiếu thực tế.

- Ví dụ bệnh nhân đi qua các quốc gia. Đúng ko ạ?

# Question: Hỏi khán giả cách truy vết bệnh nhân COVID

- Nói thêm về trường hợp của PC-Covid/Bluezone của BKAV, đi đến đâu báo đến đó...

- Những cách có thể áp dụng vào đời sống như hộ chiếu...

# Question: Đối với các ứng dụng phức tạp thì sao? Bật mý thuật ngữ Distributed tracing...

- Giới thiệu mô hình Microservices?

- Gồm rất nhiều thành phần con để tăng sự linh hoạt cho hệ thống và chia nhỏ dễ quản lý.

- Kể ra các bất lợi trong hệ thống microservices như theo dõi.

- Đặt ví dụ về bài toán xảy ra nếu request bị lỗi.

- Không lẽ tôi phải vào từng service request để xem? Rồi xem như thế nào?

# Question: Hỏi anh chị em có giải pháp gì không ạ?

- Định danh cho các request tương tự bài toán truy vết (Tương tự bài toán bệnh nhân COVID)

- Quay lại bài toán lúc nãy nó có tương tự không?

# Ví dụ là 1 kỹ sư ở twitter...

- Hãy để tôi tôi vào log của hàng trăm service và lấy những dòng log nó mention tới user id, id bài viết, người subscribe và gom nó lại thành một chỗ để điều tra nó đi như thế nào trong hệ thống của chúng ta?

- Điều tra tại sao nó không xuất hiện trên timeline?

## Đặt câu hỏi cho chính mình:

- Sẽ thế nào nếu log không chứa những thông tin cần tìm?

- Điều này được ví như mò kim đáy bể.

- Việc này rất là phổ biến nếu anh chị em đã từng làm các hệ thống...

- Log có khối lượng rất lớn, một hệ thống có hàng trăm GB

## Correlation id

- Cách hoạt động là tag tất cả các message liên quan

- Nhược điểm thì sẽ log sẽ dài hơn

## Cách hoạt động

- Giới thiệu cách hoạt động với HTTPS request

- Giúp nhận biết từ request từ bên gọi tới bên nhận.

- Tương tự với các dịch vụ trong AWS, SNS,Kinesis

- Khá tương đồng với các vấn đề đời sống

- Tập trung lại một chỗ dễ dàng truy vết

# Question: Chốt, các bạn đã hiểu cách hoạt động chưa? Comment ok...

## AWS X-RAY

- Giới thiệu về AWS, cung cấp rất nhiều giải pháp về giải quyết các vấn đề Microservices.

- No-code và low code



Khái niệm X-RAY, rất tiện dung.

Use case:

- Trace request đảm bảo an toàn bảo mật do AWS

- Xác định nút thắt cổ chai và nơi có độ trễ cao để improve performance

- Giảm thiểu sự rời rạc của dữ liệu, cung cấp thông tin để cải thiện người dùng

- Debug ứng dụng serverless realtime

## Cách sử dụng

- Enable Lambda

- Không biết bên trong đó làm gì nhưng nó đã sẵn sàng do AWS quản lý?

- Đối với các hệ thống bên ngoài thì X-RAY demon

- Sử dụng SDK?

- Mở rộng hơn 1 chút?

# Trước khi vào demo, mời anh Hoàng show code và giải thích sơ bộ về thay đổi

- Deploy version có tracing bằng cách update code

# Demo

## Mở giao diện AWS Console

## Mở CloudWatch? Show các parameter và dữ liệu đã thu thập đc trước đó

- Nếu log cũ thì nó không hoạt động do thiếu header...

# Giới thiệu X-RAY trace

- Trace

- Annotation

- Sampling (Giá)

## Nhấn mạnh chủ yếu vấn đề debug.

# Mở sơ đồ tab riêng (to rõ)

Sử dụng EventDriven event driven các tiến trình chạy song song nên bình thường rất khó debug

Sử dụng cái Middleware dùng chung cho toàn bộ các Lambda function và gắn correlation id?

Show việc service này gọi service khác như nào một chút?

Nói về đã source code đẩy lên Github và mọi người có thể tham khảo sau chương trình để câu giờ...?

Demo vẫn nhập sai thông tin như lúc đầu và xem kết quả đã có Correlation ID

# Cầm Correlation ID bị, lỗi lượn một vòng giao diện X-RAY liên quan tới request?

Do hệ thống quá phức tạp...

# Dựa vào sơ đồ service mesh, nói có rất nhiều sự tương đồng với mô hình lúc nãy

Tỉ lệ lỗi 100% trên sơ đồ, dễ theo dõi tổng quan, nhìn pro

Giới thiệu việc đo hiệu suất của hàm tốn bao nhiêu thời gian như thế (đo hiệu suất)?

Giới thiệu parent id

# Mở full log ra (Đọc từ trên xuống)

Tận dụng khả năng phân tích cá nhân chứ không thể nên thuộc vào sơ đồ.

Nếu mọi người đang expect X-Ray hiển thị ra thác nước thì không?

Do X-RAY group các tiến trình cùng lần gọi lại với nhau nên rất khó để mọi người đọc từ A->Z?

Chỉ có thể xem theo thời gian là chính.

Thác nước chỉ dành cho single process hoặc single service.

X-ray chỉ là công cụ hỗ trợ

Bài toán đòi hỏi anh em pháp hiểu nghiệp vụ trước khi debug hoặc một phần?

Tuỳ thuộc vào nghiệp vụ anh em có thể trace theo các hình thức khác nhau, không nhất thiết phải nhìn vô X-RAY mà chỉ cần nhìn log?

Chủ yếu để tham chiếu về perf trực quan. Chính vẫn là dùng log. Không phải lúc nào trace cũng đc bật, ko dùng cho transaction. Làm sai tự chịu.

Mục đích mình truyền annotation ở mỗi lần gọi nó sẽ dễ nhận biết nếu nó không nằm chung một trace thì vẫn tìm ra được chứ không phải để group vào 1 trace duy nhất như hình thác nước.

# Fix lỗi, demo nhập đúng thông tin (Thử với trường hợp thành công để xem nó từ A-Z?)

Lượn lại một vòng

Đối với Minolith thì dễ...

# Key note:

Dự án thực tế ra sao?

Ví dụ apply cho ngân hàng để lấy log?

Là giải pháp managed về rất lợi thế so với các giải pháp open source, tương tự với Datadog Trace

Nhớ để log đúng vô còn ko có log trace cũng vô nghĩa?

Chi phí triển khai?

# Trả kênh lại cho Host
