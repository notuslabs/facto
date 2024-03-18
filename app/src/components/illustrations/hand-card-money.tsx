export function HandCardMoney(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={152} height={118} fill="none" {...props}>
      <circle cx={76} cy={52} r={52} fill="#EAECF0" />
      <g filter="url(#a)">
        <rect width={115} height={72} x={18} y={12} fill="url(#b)" rx={6} />
        <path
          stroke="#D0D5DD"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.917}
          d="M76.042 47.875h2.916a2.917 2.917 0 1 0 0-5.833h-4.375c-.875 0-1.604.291-2.041.875l-8.167 7.875"
        />
        <path
          stroke="#D0D5DD"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.917}
          d="m70.208 56.625 2.333-2.042c.438-.583 1.167-.875 2.042-.875h5.833c1.605 0 3.063-.583 4.084-1.75l6.708-6.416a2.92 2.92 0 1 0-4.01-4.244l-6.125 5.687M62.917 49.333l8.75 8.75"
        />
        <path
          stroke="#D0D5DD"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.917}
          d="M83.334 43.354a4.23 4.23 0 1 0 0-8.458 4.23 4.23 0 0 0 0 8.458ZM68.75 37.667a4.375 4.375 0 1 0 0-8.75 4.375 4.375 0 0 0 0 8.75Z"
        />
        <path
          fill="#D0D5DD"
          d="M28 73.667c0-.92.746-1.667 1.667-1.667h16.666a1.667 1.667 0 1 1 0 3.333H29.667c-.92 0-1.667-.746-1.667-1.666ZM53 73.667c0-.92.746-1.667 1.667-1.667h16.666a1.667 1.667 0 1 1 0 3.333H54.667c-.92 0-1.667-.746-1.667-1.666ZM78 73.667c0-.92.746-1.667 1.667-1.667h16.666a1.667 1.667 0 1 1 0 3.333H79.667c-.92 0-1.667-.746-1.667-1.666ZM103 73.667c0-.92.746-1.667 1.667-1.667h16.666a1.667 1.667 0 1 1 0 3.333h-16.666A1.667 1.667 0 0 1 103 73.667Z"
        />
      </g>
      <circle cx={21} cy={5} r={5} fill="#F2F4F7" />
      <circle cx={18} cy={109} r={7} fill="#F2F4F7" />
      <circle cx={145} cy={35} r={7} fill="#F2F4F7" />
      <circle cx={134} cy={8} r={4} fill="#F2F4F7" />
      <defs>
        <linearGradient
          id="b"
          x1={22.005}
          x2={19.913}
          y1={83.148}
          y2={17.25}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E4E7EC" />
          <stop offset={1} stopColor="#F9FAFB" />
        </linearGradient>
        <filter
          id="a"
          width={148.333}
          height={105.333}
          x={1.333}
          y={12}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feMorphology in="SourceAlpha" radius={3.333} result="effect1_dropShadow_47_27260" />
          <feOffset dy={6.667} />
          <feGaussianBlur stdDeviation={3.333} />
          <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.04 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_47_27260" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feMorphology in="SourceAlpha" radius={3.333} result="effect2_dropShadow_47_27260" />
          <feOffset dy={16.667} />
          <feGaussianBlur stdDeviation={10} />
          <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0" />
          <feBlend in2="effect1_dropShadow_47_27260" result="effect2_dropShadow_47_27260" />
          <feBlend in="SourceGraphic" in2="effect2_dropShadow_47_27260" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
