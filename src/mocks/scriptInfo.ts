const taleThumb = "/assets/images/TaleThumb.png";
const testAudioUrl = "/assets/audios/watsonSample.wav";

const scripts = [
  [
    {
      imageUrl: taleThumb,
      text: "아주 오래전, 세상이 지금처럼 만들어지기 전. 하늘과 땅의 경계가 아직 분명하지 않던 시절, 커다란 몸집과 굉장한 힘을 지닌 한 여신이 탐라에 살고 있었습니다. 그녀의 이름은 설문대할망. 하늘보다 키가 크고, 바다보다 넓은 품을 가진 존재였습니다. 사람들은 그녀를 섬을 만든 할망, 생명을 불어넣은 어머니, 모든 것의 시작이자 끝이라 불렀습니다.",
      audioUrl: "/assets/audios/seolmun/seolmun1.wav",
    },
    {
      imageUrl: taleThumb,
      text: "어느 날, 설문대할망은 하늘 아래 누워 잠을 자고 있었습니다. 갑자기 벌떡 일어나 앉은 그녀는, 아주 큰 방귀를 한 번 뀌었습니다. 그 순간, 세상이 흔들리기 시작했습니다. 하늘과 땅이 갈라지고, 바다에는 불기둥이 솟았으며 섬은 뒤틀리고, 바람은 사방으로 몰아쳤습니다. 설문대할망은 바닷물과 흙을 퍼서 세상의 혼란을 잠재우고자 했습니다.",
      audioUrl: "/assets/audios/seolmun/seolmun2.wav",
    },
    {
      imageUrl: taleThumb,
      text: '설문대할망은 흙을 퍼서 높은 산을 만들기로 결심합니다. 하지만 흙을 날라야 할 만큼 땅은 넓고, 손은 바쁩니다. 그녀는 무언가에 흙을 담아 날라야겠다고 생각했습니다. "흠... 이 많은 흙을 무엇으로 옮기는 게 좋을까...?"',
      audioUrl: "/assets/audios/seolmun/seolmun3.wav",
      choices: [
        { text: "치마를 이용해 흙을 퍼 나르기", next: 3 },
        { text: "선택지2", next: 3 },
        { text: "", next: 3 },
      ],
    },
    {
      imageUrl: taleThumb,
      text: "설문대할망은 자신의 치마폭을 활짝 펼쳐 그 안에 흙을 가득 담아 나르기 시작했습니다. 치마에서 흘러내린 흙들은 탐라의 여기저기 흩어져 오름이 되었고, 가장 마지막에 쏟아낸 흙은 한라산이 되었습니다. 세상은 점차 안정되어 갔고, 그녀는 자신이 만든 땅을 바라보며 만족스럽게 고개를 끄덕였습니다.",
      audioUrl: "/assets/audios/seolmun/seolmun4.wav",
    },
    {
      imageUrl: taleThumb,
      text: '산을 세운 설문대할망은 이번엔 바다를 바라보았습니다. "이제는 바다에도 생명이 있어야지." 할망은 바다에 앉아 오줌을 길게 누었습니다. 그 줄기 속에서 해초, 문어, 전복, 물고기들이 흘러나왔습니다. 바다는 금세 풍성해졌고, 사람들은 물속에서 숨을 참으며 물질을 하는 법을 배우기 시작했습니다. 그렇게 이 세상에는 산도, 바다도, 사람도, 하나씩 자리를 잡아가기 시작했습니다.',
      audioUrl: "/assets/audios/seolmun/seolmun5.wav",
    },
    {
      imageUrl: taleThumb,
      text: '어느 날, 할망은 사람들과 육지를 오갈 수 있게 다리를 놓아 주겠다고 사람들에게 말합니다. "내가 육지까지 다리를 놓아 줄 테니, 대신 나에게 뭘 하나 만들어 줘야 한다"',
      audioUrl: "/assets/audios/seolmun/seolmun6.wav",
      choices: [
        { text: "속옷을 만들어 준다.", next: 6 },
        { text: "아무것도 만들어 주지 않는다.", next: 6 },
      ],
    },
    {
      imageUrl: taleThumb,
      text: "사람들은 설문대할망에게 속옷 한 벌을 만들어 주기로 했습니다. 속옷을 짓기 위해선 명주실 100 통이 필요했습니다. 모두가 힘을 모았지만, 끝내 99통 밖에 모으지 못했습니다. 속옷은 완성되지 않았고,  설문대할망은 결국 다리 놓기를 그만두었습니다. 그렇게 탐라, 제주는 육지에서 떨어진 외로운 섬으로 남게 되었습니다.",
      audioUrl: "/assets/audios/seolmun/seolmun7.wav",
    },
  ],
  [
    {
      imageUrl: taleThumb,
      text: "설문대할망은 자신의 치마폭을 활짝 펼쳐 그 안에 흙을 가득 담아 나르기 시작했습니다. 치마에서 흘러내린 흙들은 탐라의 여기저기 흩어져 오름이 되었고, 가장 마지막에 쏟아낸 흙은 한라산이 되었습니다. 세상은 점차 안정되어 갔고, 그녀는 자신이 만든 땅을 바라보며 만족스럽게 고개를 끄덕였습니다.",
      audioUrl: testAudioUrl,
      choices: [
        { text: "선택지 1", next: 1 },
        { text: "선택지 2", next: 1 },
      ],
      choiceIndex: 0,
    },
    {
      imageUrl: taleThumb,
      text: "뾰족한 한라산 봉우리를 꺾어 던지자 산방산이 탄생하고, 분화구는 백록담이 되었습니다.",
      audioUrl: testAudioUrl,
    },
    {
      imageUrl: taleThumb,
      text: "설문대할망이 다리를 뻗어 관탈섬에 구멍을 내고, 남은 흙이 바다에 흘러 우도가 되었습니다.",
      audioUrl: testAudioUrl,
      choices: [
        { text: "선택지 3", next: 3 },
        { text: "선택지 4", next: 3 },
      ],
      choiceIndex: 1,
    },
    {
      imageUrl: taleThumb,
      text: "속곳을 만들려 명주 100통이 필요했지만 99통만 모아 다리를 놓지 못한 채 제주 앞바다에 흔적이 남아 있습니다.",
      audioUrl: testAudioUrl,
    },
  ],
];

export default scripts;
