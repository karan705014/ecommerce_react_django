# scoring.pyx
def calculate_score(int price, int product_id):
    cdef int score
    score = price * 2 + product_id
    return score
