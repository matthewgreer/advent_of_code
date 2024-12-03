/* input is a large string of "corrupted" data, within which are some "mul" (multiplication) operation instructions. valid instructions are mul(X,Y), where X and Y are each 1-3 digit numbers. invalid characters invalidate a "mul" instruction. for example:
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
  contains only four real "mul" instructions: mul(2,4), mul(5,5), mul(11,8), and mul(8,5). the sum of the products of these instructions is 2*4 + 5*5 + 11*8 + 8*5 = 8 + 25 + 88 + 40 = 161.

  in part 2, we will be asked to abide by "do" and "don't" instructions which enable or disable following the "mul" instructions.


  the function returns:
    1. the sum of the products of the valid "mul" instructions in the input.
    2. the sum of the products of valid "mul" instructions when enabled by the "do" instruction.

*/

import getInput from "./shared/getInput.js";

const input = await getInput(3);
const lastIdx = input.length - 1;
const DIGITS = "0123456789"

const checkM = (i) => {
  if (input[i + 1] === "u" &&
    input[i + 2] === "l" &&
    input[i + 3] === "("
  ) {
    let j = i + 4,
        numStr1 = "",
        numStr2 = "";

    if (!DIGITS.includes(input[j])) return false;

    let k = j;
    while (DIGITS.includes(input[k]) &&
      k - j < 3 &&
      k < lastIdx
    ) {
      numStr1 += input[k];
      k++;
    };

    j = k;
    if (input[j] !== ",") return false;

    j++;

    if (!DIGITS.includes(input[j])) return false;

    k = j;
    while (DIGITS.includes(input[k]) &&
      k - j < 3 &&
      k < lastIdx)
    {
      numStr2 += input[k];
      k++;
    }

    if (input[k] !== ")") return false;

    console.log(input.substring(i, k+1));
    return [parseInt(numStr1), parseInt(numStr2), k];
  } else {
    return false;
  }
}

const addValidMuls = (input) => {
  let i = 0,
      sum = 0;

  while (i <= lastIdx - 8) {  // the minimum length of a valid mul "mul(x,y)"
    if (input[i] === "m") {
      let validFactors = checkM(i);
      if (validFactors) {
        const [a, b, newIdx] = validFactors;
        console.log("sum", sum);
        console.log("a x b =", a * b);
        sum += (a * b);
        console.log("new sum", sum);
        i = newIdx;
      }
    }
    i++;
  }

  return sum;
};

const testData = "<;'{:*mul(481,556)from()*{select():what()'#mul(905,420)what()mul(327,771), who()}mul(45,757)mul(366,653)where(459,755))don't();when()mul(807,855)where()$)>@mul(48,816)mul(370,665)@*>who()^,when()mul(155,426) mul(132,914)^%select()&when()/from()(+}mul(296,176)mul(361,479)%{;!,'who()where():mul(506,495)#who()&%< ^mul(481,87))&!;mul(541,563)%don't(){}'-),from()$mul(495,427)^when()mul(640,499)select()}:] )%+()mul(967,918)?when()select()<{/who()what()mul(505,225)(mul(90,482)>!from()when()#do()mul(620,841):who()!mul(719,850)where()-)mul(931,185)?;select()]@,why()%]mul(39,103)mul(687,103)$%];how(337,314)[}$-when()mul(282,494):;!where(188,779);who()mul(342,554)<^who()(why()where()who(345,491)%mul(407,74)why()&}'%'mul(324,781)mul(90,925):from()mul(828,16)mul(438,549){what()>$why()*what(35,607)mulwho()mul(91,548)>,what()select()]&how()@mul(384,93!select(),where()$mul(835,662)@{don't():#<^/-+mul(489,462)>>where(){why()where()---when()mul(53,461)/~?mul(273,777)mul(119,879)+@'when()-mul(585,949)?['when()from(946,632)mul(22,105)>-:how())from();mul(439,876)?mulwho()@who()when()<@{-mul(111,687)$&mul(432,628)%*,{when()mul(287,508)'-select()}don't()/#~-@from()[:#mul(111,655)%: &;mul(518,391)don't()<from()%-~-!@mul(301,138)(,how()mul(654,521)!*when()--({who()how()don't() ~where()!~mul(910,877)?+select()+-[#&do()*< +-what()&how()%$mul(123,641)*?&mul(488,741)<}@@&?what()how()what())mul(301,649);why()%mul(259,148)$~')&[{mul(83,94)~select()~^when()mul(232,572)mul(889,281)why()%*#$}<[mul(256,607)}({mul(382,953)what()how()why() who()from()!?%mul(433,147)+>&mul(197,749)@who()*mul(935,21)+> who()why()mul(299,881)who()]@+%/from()[?do();{+[why()$select()#mul(264,731)]'select()what();+who()mul(713,161)where(931,649))mul(360,529)}where()!;]how()<mul;$-:]]how()#where()select()when()mul(971,836)when():[how(){mul(567,429)!}{{',mul(522,696),why(){mul(833;#-&#,select()~mul(80,121)+*,#how()select()${>how()mul(619,728)how()<%}+}mul(420,324);{!from();mul;)>mul(144,181)who()}?~where():who()${ mul(261,691),why() /+mul(189,450)"

console.log(addValidMuls(input));
