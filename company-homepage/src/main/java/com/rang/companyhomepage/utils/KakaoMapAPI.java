package com.rang.companyhomepage.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class KakaoMapAPI {

    private static final String API_KEY = "008b79e594d7ab4e1058e1180ccf546c";

    public static void main(String[] args) {
        try {
            // 검색할 장소 이름
            String query = "";
            // API 요청 URL
            String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + java.net.URLEncoder.encode(query, "UTF-8");

            // URL 객체 생성
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            // GET 요청 설정
            con.setRequestMethod("GET");
            con.setRequestProperty("Authorization", "KakaoAK " + API_KEY);

            // 응답 읽기
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            // 응답 내용 출력
            System.out.println(response.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
