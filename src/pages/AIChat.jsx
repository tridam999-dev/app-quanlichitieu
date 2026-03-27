import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Mic } from 'lucide-react';

export default function AIChat({ onBack }) {
    const [messages, setMessages] = useState([
        { id: '1', sender: 'ai', text: 'Chào bạn! Mình là Trợ lý AI ở đây. Mình không chỉ là một chiếc máy soi báo cáo tài chính đâu, bạn có thể tâm sự chuyện buồn vui, áp lực công việc hay bất cứ tâm sự gì cũng được nhé. Hôm nay bạn thấy thế nào?' }
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const preVoiceInputRef = useRef('');

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Tiếp tục lắng nghe
        recognition.lang = 'vi-VN'; // Dùng tiếng Việt
        recognition.interimResults = true; // Cho phép trả về kết quả tạm thời (khi đang nói)

        recognition.onstart = () => {
            setIsListening(true);
        };
        
        recognition.onresult = (e) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = 0; i < e.results.length; ++i) {
                if (e.results[i].isFinal) {
                    finalTranscript += e.results[i][0].transcript;
                } else {
                    interimTranscript += e.results[i][0].transcript;
                }
            }
            
            // Kết hợp phần gõ tay cũ + phần lời rành mạch + phần lời đang ngập ngừng
            const prefix = preVoiceInputRef.current.trim();
            const currentVoice = (finalTranscript + ' ' + interimTranscript).trim();
            const result = prefix ? prefix + ' ' + currentVoice : currentVoice;
            setInput(result);
        };

        recognition.onerror = (e) => {
            console.error('Lỗi thu âm (Microphone error):', e.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []); // Bỏ 'input' khỏi dependency để không bị tạo lại instance liên tục gây lag / ngắt quãng

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói. Vui lòng dùng Google Chrome, Safari hoặc Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            preVoiceInputRef.current = input; // Lưu lại text hiện tại trước khi bắt đầu thu
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error('Mic is already started or cannot start', err);
            }
        }
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getAIResponse = (text) => {
        const lower = text.toLowerCase();
        
        // --- TÂM SỰ & CẢM XÚC (CHATTING/VENTING) ---
        if (lower.includes('mệt') || lower.includes('đuối')) {
            return "Thương bạn! Những lúc mệt mỏi thế này, số dư hay báo cáo không còn quan trọng nữa. Bạn hãy đặt điện thoại xuống, uống một ngụm nước ấm và nghỉ ngơi sớm đi. Cơ thể bạn là vốn liếng quý giá nhất đấy!";
        }
        if (lower.includes('buồn') || lower.includes('chán') || lower.includes('tệ') || lower.includes('khóc')) {
            return "Mình đang ở đây lắng nghe bạn. Có những ngày bầu trời thật xám xịt đúng không? Hãy cứ để mọi cảm xúc được trôi qua. Nếu muốn chia sẻ thêm, mình sẵn sàng đọc hết những gì bạn viết. Mình tin bạn sẽ sớm vượt qua được thôi! 💙";
        }
        if (lower.includes('stress') || lower.includes('áp lực') || lower.includes('bức bối')) {
            return "Bên ngoài chắc mọi thứ đang quay cuồng lắm nhỉ? Cảm giác quá tải là hoàn toàn bình thường. Bạn hít một hơi thật sâu cùng mình nhé: Hít vào... Thở ra... Mọi chuyện rồi sẽ tìm được lối thoát thôi. Đừng quá khắt khe với bản thân!";
        }
        if (lower.includes('không có tiền') || lower.includes('hết tiền') || lower.includes('nghèo')) {
            return "Biết là lúc này ví hơi xẹp và khá căng thẳng, nhưng giai đoạn khó khăn tài chính nào rồi cũng sẽ trôi qua. Chúng ta sẽ cùng nhau thắt lưng buộc bụng một chút, cắt bớt khoản ăn vặt rồi mọi thứ sẽ lại đi vào quỹ đạo thôi. Đừng quá lo lắng!";
        }
        if (lower.includes('thất bại') || lower.includes('thua') || lower.includes('chậm')) {
            return "Không có ai thành công mà chưa từng nếm mùi vấp ngã đâu. Bạn không đi lùi, bạn chỉ đang tích lũy thêm bài học đắt giá mà thôi. Cứ đi từng bước nhỏ, vì những mầm cây lớn đều trưởng thành trong im lặng mà!";
        }
        if (lower.includes('vui') || lower.includes('tuyệt') || lower.includes('thành công') || lower.includes('đậu') || lower.includes('tốt')) {
            return "Tuyệt quá!!! Xin chúc mừng bạn nhé! Nghe giọng điệu là mình thấy 100% năng lượng tích cực rồi. Tự thưởng cho bản thân một bữa ăn ngon hoặc một món quà nhỏ đi nào (nhưng nhớ note chi tiêu nha 😉).";
        }
        if (lower.includes('cô đơn') || lower.includes('một mình') || lower.includes('không ai')) {
            return "Bạn không hề một mình đâu. Tụ tập bạn bè có lúc cũng vui, nhưng cô đơn là lúc tĩnh tâm tốt nhất để hiểu bản thân. Dù ngoài kia vạn người xô bồ, ở đây luôn có mình - Trợ lý nhỏ của bạn - sẵn sàng trò chuyện 24/7!";
        }
        if (lower.includes('đói') || lower.includes('món gì') || lower.includes('ăn gì')) {
            return "Đói thì phải tìm gì bỏ bụng ngay! Bạn thèm chút gì nóng hổi như tô phở bát bún, hay cơm nhà? Nếu còn lăn tăn, tung đồng xu chọn món nhé, ăn ngon thì cơ thể mới có năng lượng làm giàu được!";
        }
        if (lower.includes('tâm sự') || lower.includes('nói chuyện') || lower.includes('kể chuyện')) {
             return "Sẵn lòng luôn! Mình là một AI nhưng lại rất thích hóng chuyện con người. Hôm nay bạn gặp chuyện bực mình ở chỗ làm, hay thấy một chú mèo dễ thương ở quán cafe? Nói mình nghe nào!";
        }
        if (lower.includes('người yêu') || lower.includes('chia tay') || lower.includes('thất tình')) {
             return "Sự chia ly hay tổn thương tình cảm là một nỗi đau không có ngôn từ nào xoa dịu ngay được. Hãy cho phép bản thân được yếu đuối 1-2 ngày, ăn đồ mình thích, khóc cho nhẹ lòng. Nhưng hãy nhớ yêu thương bản thân mình trước nhất nhé. Cố lên bạn của tui!";
        }
        // --- TÀI CHÍNH (FINANCIAL) ---
        if (lower.includes('tiết kiệm') && lower.includes('bao nhiêu')) {
            return "Theo nguyên tắc chung, bạn nên tiết kiệm tối thiểu 20% thu nhập mỗi tháng (Quy tắc 50/30/20). Nếu mới bắt đầu, 10% hoặc vạch ra một định mức (1 triệu/tháng) thôi cũng rất tuyệt rồi!";
        }
        if (lower.includes('tiết kiệm') && (lower.includes('cách nào') || lower.includes('làm sao'))) {
            return "Để tiết kiệm hiệu quả, hãy thử:\n1. Tích lũy tự động: Trích tiền ngay khi nhận lương.\n2. Quy tắc 24h: Chờ 1 ngày trước khi mua hàng.\n3. Hủy ngay gói đăng ký tháng (Netflix...) nếu ít dùng.";
        }
        if (lower.includes('giảm chi') || lower.includes('ăn uống')) {
             return "Để giảm chi tiêu ăn uống, bạn có thể: \n1. Tự mang cơm trưa đi làm.\n2. Đặt thẻ ngân sách Ăn Uống.\n3. Cắt giảm tần suất đi cafe/trà sữa.\n4. Đi siêu thị 1 lần/tuần kèm danh sách.";
        }
        if (lower.includes('quản lý') || lower.includes('hiệu quả') || lower.includes('phân bổ')) {
            return "Hãy chia thu nhập thành 6 chiếc lọ (JARS) hoặc dùng mốc 50/30/20:\n- 50% Nhu cầu thiết yếu\n- 30% Sở thích cá nhân\n- 20% Tiết kiệm & Tích lũy.\nNhớ dự phòng 3-6 tháng lương làm quỹ khẩn cấp!";
        }
        if (lower.includes('đầu tư') || lower.includes('chứng khoán') || lower.includes('sinh lời')) {
            return "Đầu tư chỉ an toàn khi bạn đã có Quỹ Dự Phòng. Bạn có thể bắt đầu bằng Chứng chỉ quỹ mở (phân tán rủi ro) hoặc Tích lũy ví điện tử rủi ro thấp. Nguyên tắc: Đừng bỏ trứng chung giỏ!";
        }
        if (lower.includes('nợ') || lower.includes('thẻ tín dụng') || lower.includes('lãi suất')) {
            return "Luôn ưu tiên xử lý các khoản nợ thẻ tín dụng/vay tiêu dùng trước vì lãi cực cao. Áp dụng 'Quả cầu tuyết' (trả nợ nhỏ để lấy động lực) hoặc 'Lở tuyết' (trả nợ lãi lớn trước).";
        }
        if (lower.includes('lương') && lower.includes('hết')) {
            return "Bạn đang bị dính lời nguyền 'Chưa hết tháng đã hết tiền' đúng không? Lời khuyên: Hãy trích ngay 10% ra gửi tiết kiệm lúc Lương vừa ting ting, rồi mới được đem phần kia đi xài!";
        }
        if (lower.includes('cảm ơn') || lower.includes('hay quá') || lower.includes('đỉnh')) {
            return "Không có chi! Nhiệm vụ của mình là đồng hành cùng bạn - chờ chực lau ráo nỗi buồn hay ăn mừng chiến thắng nhỏ xíu của bạn. Bạn cần gì cứ hú mình nha! ✨";
        }
        if (lower.includes('chào') || lower.includes('hi ')) {
            return "Chào ràoooo!! Hôm nay bạn muốn lên chiến lược phân bổ tiền nong, hay đơn giản chỉ muốn phàn nàn về sếp nào? Mình nghe đây!";
        }
        
        return "Mình lắng nghe và ghi nhận tâm trạng của bạn. Đôi khi cuộc sống làm mình hơi lúng túng, nhưng không sao, bạn cứ thả lỏng và trải lòng thêm đi, mình vẫn ở đây đợi nghe tiếp từ bạn nè!";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if(!input.trim()) return;
        const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        if (isListening) {
             recognitionRef.current?.stop();
             setIsListening(false);
        }

        setTimeout(() => {
            const aiReply = { id: (Date.now()+1).toString(), sender: 'ai', text: getAIResponse(input) };
            setMessages(prev => [...prev, aiReply]);
        }, 800);
    };

    return (
        <div className="page animate-fade-in flex-column" style={{ height: '100%', display: 'flex', zIndex: 100, background: 'var(--bg-color)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-16)' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, display: 'flex' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: 6, borderRadius: '50%' }}>
                        <Sparkles size={20} />
                    </div>
                    <h1 className="title" style={{ margin: 0, fontSize: 18 }}>Trợ lý & Tâm sự AI</h1>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-16)', margin: '0 -var(--space-16)', display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ 
                        display: 'flex', 
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            maxWidth: '85%',
                            padding: '14px 18px',
                            borderRadius: '20px',
                            borderBottomRightRadius: msg.sender === 'user' ? 4 : 20,
                            borderBottomLeftRadius: msg.sender === 'ai' ? 4 : 20,
                            background: msg.sender === 'user' ? 'var(--primary)' : 'var(--card-bg)',
                            color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                            fontSize: '15px',
                            lineHeight: 1.5,
                            boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(11, 31, 58, 0.15)' : 'var(--shadow-sm)',
                            whiteSpace: 'pre-wrap'
                        }}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={endRef} style={{ height: 20 }} />
            </div>

            <form onSubmit={handleSend} style={{ padding: 'var(--space-16) 0', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
                <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', padding: '6px 6px 6px 16px', borderRadius: 28, background: 'var(--card-bg)', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <input 
                            type="text" 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Nhập hoặc nói gì đó..."
                            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '15px', color: 'var(--text-main)' }}
                        />
                    </div>
                    
                    <button type="button" onClick={toggleListening} style={{ 
                        background: isListening ? 'rgba(46, 216, 163, 0.15)' : 'transparent', 
                        color: isListening ? 'var(--success)' : 'var(--text-muted)', 
                        border: 'none', 
                        padding: '10px', 
                        borderRadius: '50%',
                        display: 'flex',
                        transition: 'all 0.2s ease',
                        animation: isListening ? 'pulseVoice 1.5s infinite' : 'none'
                    }}>
                        <Mic size={20} strokeWidth={2} />
                    </button>

                    <button type="submit" disabled={!input.trim()} style={{ 
                        background: input.trim() ? 'var(--primary)' : 'var(--border-color)', 
                        color: input.trim() ? 'white' : 'var(--text-muted)', 
                        border: 'none', 
                        padding: 12, 
                        borderRadius: '50%',
                        display: 'flex',
                        transition: 'all var(--transition-fast)'
                    }}>
                        <Send size={18} strokeWidth={2} />
                    </button>
                    
                    {isListening && <div style={{ position: 'absolute', top: -30, left: 16, fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Đang nghe bạn nói...</div>}
                </div>
            </form>
        </div>
    );
}
