document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guestName = document.getElementById('guestName').value;
    const responseMsg = document.getElementById('responseMsg');

    const reservationData = { checkIn, checkOut, guestName };

    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData)
        });

        if (response.ok) {
            responseMsg.textContent = "예약 요청이 완료되었습니다. 관리자 확인 후 확정됩니다.";
            responseMsg.className = "mt-4 text-center text-sm text-green-600 block";
        } else {
            throw new Error('서버 오류');
        }
    } catch (error) {
        responseMsg.textContent = "예약 처리 중 문제가 발생했습니다.";
        responseMsg.className = "mt-4 text-center text-sm text-red-600 block";
    }
});