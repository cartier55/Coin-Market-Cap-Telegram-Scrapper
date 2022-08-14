import pandas as pd


def combine():
    df1 = pd.read_csv('./telegram_links_1_7.csv')
    df2 = pd.read_csv('./telegram_links_8_100.csv')
    csv_merged = pd.concat([df1, df2], ignore_index=True)

    # 6. Single DF is saved to the path in CSV format, without index column
    csv_merged.to_csv('telegram_links.csv', index=False)


# combine()


def dups():
    df = pd.read_csv('./telegram_links.csv')
    df.sort_values("telegram_links", inplace=True)
    df.drop_duplicates(subset="telegram_links",
                       keep=False, inplace=True)
    print(len(df))
    print(df)
    df.to_csv('./telegram_links_no_dups.csv', index=False)


dups()
