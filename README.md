# js-substring_search-Boyer-Moore
Алгоритм Бойера Мура для поиска подстроки в строке

**Пример запуска:**

js-substring_search-Boyer-Moore>node src/bm.js -n 2 -t resources/Harry.txt resources/HarrySubStr.txt

**-n number**, если установлен, то выводится number ближайших вхождений подстроки\
**-t**, если установлен, то выводится время работы алгоритма\
**resources/Harry.txt** - текст про Гарри Поттера\
**resources/HarrySubStr.txt** - подстрока "Гарри"

Для примера выше будет выведен результат:\
WorkTime: 15ms\
  Г а р и\
0)1 0 0 0\
1)1 2 0 0\
2)1 0 3 0\
3)1 0 4 0\
4)1 0 0 5\
5)1 0 0 0\
------First n entries-----\
|            6652           |\
|            7338           |\
--------------------------\
